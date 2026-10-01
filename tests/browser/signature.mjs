import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',out=process.env.TEST_OUT||'work/signature'
mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true}),results=[],errors=[]
try{
 for(const theme of ['light','dark'])for(const width of [320,390,768,1024,1200,1440]){
  const context=await browser.newContext({viewport:{width,height:width<1000?1130:1000},reducedMotion:'reduce'})
  await context.addInitScript(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let writes=0
  await page.route('**/api/**',route=>{if(route.request().method()!=='GET')writes++;return route.abort()})
  await page.goto(base);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready)
  assert.ok(await page.getByText('Illustrative example · not live',{exact:true}).isVisible())
  const labelBox=await page.locator('.lv-signature-demo-label').boundingBox(),buttonsBox=await page.locator('.lv-signature-controls [role=group]').boundingBox();assert.ok(labelBox.y+labelBox.height<=buttonsBox.y,'Demo qualification precedes interaction')
  const scattered=page.getByRole('button',{name:'01 Scattered',exact:true}),connected=page.getByRole('button',{name:'02 Connected',exact:true})
  for(const state of [false,true,false,true]){
   await (state?connected:scattered).focus();await page.keyboard.press('Enter')
   assert.equal(await connected.getAttribute('aria-pressed'),String(state))
   assert.ok(await (state?connected:scattered).evaluate(el=>el===document.activeElement))
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
   const assets=await page.locator('.lv-signature-strands img').evaluateAll(xs=>xs.map(img=>({src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})))
   assert.ok(assets.every(x=>x.loaded&&x.width===x.naturalWidth&&x.height===x.naturalHeight),'Original export geometry; no stretching')
   const motions=await page.locator('.lv-signature-opening *').evaluateAll(xs=>xs.map(x=>({animation:getComputedStyle(x).animationName,duration:getComputedStyle(x).transitionDuration})))
   assert.ok(motions.every(x=>x.animation==='none'&&x.duration==='0s'))
   assert.equal(await page.locator(`.lv-signature-labels.${state?'connected':'scattered'} .signal:visible`).count(),state?3:4,'Same enquiry/details/draft objects visible on mobile and desktop')
   assert.equal(await page.locator('.lv-signature-result-preview').count(),state?1:0,'Output preview follows selected state without disclosure')
   if(state){assert.match(await page.locator('.lv-signature-result-preview').innerText(),/SYNTHETIC EXAMPLE.*Captured details.*preferred date, time and service.*Draft reply.*No booking, quote or message is sent here/s);assert.equal(await page.locator('.lv-signature-output').getAttribute('open'),null);if(width<1200)assert.ok(await page.getByText('HUMAN APPROVAL',{exact:true}).isVisible())}
   if(state)assert.match(await page.getByRole('status').innerText(),/Details filed.*Reply drafted.*nothing sends/s)
  }
  const output=page.locator('.lv-signature-output summary')
  await output.focus();await page.keyboard.press('Enter')
  assert.ok(await page.locator('.lv-signature-output').getByRole('heading',{name:'Captured details',exact:true}).isVisible())
  assert.ok(await page.getByRole('heading',{name:'Draft reply — for review',exact:true}).isVisible())
  assert.match(await page.locator('.lv-signature-output').innerText(),/No booking, quote or message is sent here/)
  await page.keyboard.press('Space')
  const controlBox=await page.locator('.lv-signature-controls').boundingBox(),sceneBox=await page.locator('.lv-signature-scene').boundingBox()
  assert.ok(controlBox.y+controlBox.height<=sceneBox.y,'Control above demonstration')
  await connected.press('Home');assert.equal(await scattered.getAttribute('aria-pressed'),'true');assert.ok(await scattered.evaluate(el=>el===document.activeElement))
  await scattered.press('End');assert.equal(await connected.getAttribute('aria-pressed'),'true')
  for(const state of [false,true]){
   await (state?connected:scattered).click()
   if(process.env.AXE_CORE_PATH){if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:process.env.AXE_CORE_PATH});const v=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations);assert.deepEqual(v,[]);writeFileSync(`${out}/axe-${theme}-${width}-${state}.json`,JSON.stringify(v))}
   await page.evaluate(()=>scrollTo(0,0))
   if([390,1440].includes(width))await page.screenshot({path:`${out}/${theme}-${width}-${state?'connected':'scattered'}.png`,fullPage:false})
  }
  await page.setViewportSize({width:width<1000?1440:390,height:1000});assert.equal(await connected.getAttribute('aria-pressed'),'true','State survives orientation/layout change')
  await page.setViewportSize({width,height:1000})
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body *')].map(el=>[el,getComputedStyle(el).fontSize]);for(const [el,size] of sizes)el.style.fontSize=`${parseFloat(size)*2}px`})
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'200% text reflow')
  await page.locator('.lv-signature-output summary').click()
  if(width<600){const fields=await page.locator('.lv-signature-output dl>*').evaluateAll(xs=>xs.map(x=>({top:x.getBoundingClientRect().top,bottom:x.getBoundingClientRect().bottom})));assert.ok(fields.every((x,i)=>i===0||x.top>=fields[i-1].bottom),'Enlarged detail fields do not overlap')}
  const previewBox=await page.locator('.lv-signature-result-preview').boundingBox(),reviewBox=await page.locator('.lv-signature-review').boundingBox();assert.ok(previewBox.y>=reviewBox.y+reviewBox.height,'Enlarged approval and visible preview do not overlap')
  assert.equal(writes,0);results.push({theme,width,states:true,keyboard:true,reducedMotion:true,originalGeometry:true,noWrite:true,axeScans:process.env.AXE_CORE_PATH?2:0})
  await context.close()
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});await page.goto(base);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready)
 await page.getByRole('button',{name:'02 Connected',exact:true}).click()
 const timing=await page.locator('.lv-signature-review').evaluate(el=>({duration:getComputedStyle(el).animationDuration,delay:getComputedStyle(el).animationDelay,count:getComputedStyle(el).animationIterationCount}))
 assert.deepEqual(timing,{duration:'0.65s',delay:'1s',count:'1'})
 await page.waitForTimeout(1750);assert.equal(await page.locator('.lv-signature-review').evaluate(el=>getComputedStyle(el).opacity),'1')
 for(let i=0;i<8;i++)await page.getByRole('button',{name:i%2?'02 Connected':'01 Scattered',exact:true}).click()
 await page.getByRole('button',{name:'01 Scattered',exact:true}).click();await page.waitForTimeout(900)
 assert.equal(await page.locator('.lv-signature-strands.scattered').evaluate(el=>getComputedStyle(el).opacity),'1')
 assert.equal(await page.locator('.lv-signature-strands.connected').evaluate(el=>getComputedStyle(el).opacity),'0')
 assert.equal(await page.locator('.lv-signature-result-preview').count(),0,'Rapid reversal removes preview with Connected state')
 assert.deepEqual(errors,[]);writeFileSync(out+'/motion.json',JSON.stringify({timing,settledAt1750ms:true,rapidReversal:true},null,2))
 console.log(`PASS ${results.length} signature responsive/theme cases, 24 Axe scans, keyboard, original vectors, reduced motion, orientation, 200% text, finite motion, rapid reversal; no submissions.`)
}finally{writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));await browser.close()}
