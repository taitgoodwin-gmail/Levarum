// Diagnostic receipts for comparing native font/layout engines; no forced line counts.
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {mkdirSync,writeFileSync} from 'node:fs'
import {platform,release,arch} from 'node:os'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',out=process.env.TEST_OUT||'work/font-metrics'
mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const selectors=['h1>span','h1>em','.lv-signature-message>p','.lv-signature-action','.lv-signature-brand','.lv-signature-controls button']
const results=[]
try{
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:1400},deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-US'})
  await context.addInitScript(()=>localStorage.setItem('levarum.theme.v1','dark'))
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(base);await page.locator('h1').waitFor()
  // Waiting after the relevant elements exist prevents awaiting an earlier, empty FontFaceSet.
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))})
  async function metrics(){return await page.evaluate(selectors=>selectors.map(selector=>{
   const el=document.querySelector(selector),s=getComputedStyle(el),r=el.getBoundingClientRect()
   const props=['fontFamily','fontSize','fontWeight','fontStyle','fontStretch','fontVariationSettings','fontOpticalSizing','fontKerning','fontFeatureSettings','fontSynthesis','letterSpacing','wordSpacing','lineHeight','textRendering','textSizeAdjust','whiteSpace','textWrap','boxSizing','width','maxWidth','paddingLeft','paddingRight','gap','flexShrink','display']
   const textRects=[];for(const child of el.childNodes)if(child.nodeType===Node.TEXT_NODE&&child.textContent.trim()){const range=document.createRange();range.selectNodeContents(child);for(const rect of range.getClientRects())textRects.push({x:rect.x,y:rect.y,width:rect.width,height:rect.height})}
   const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
   return{selector,text:el.textContent.trim(),style:Object.fromEntries(props.map(p=>[p,s[p]])),rect:{x:r.x,y:r.y,width:r.width,height:r.height},textRects,canvasTextWidth:ctx.measureText(el.textContent.trim()).width}
  }),selectors)}
  const ready=await metrics()
  await page.waitForTimeout(2100)
  const settled=await metrics();assert.deepEqual(settled,ready,'No font/layout change after fonts.ready and two frames')
  const client=await context.newCDPSession(page);await client.send('DOM.enable');await client.send('CSS.enable');const{root}=await client.send('DOM.getDocument')
  const fonts=[];for(const selector of selectors){const{nodeId}=await client.send('DOM.querySelector',{nodeId:root.nodeId,selector});fonts.push({selector,...await client.send('CSS.getPlatformFontsForNode',{nodeId})})}
  assert.ok(fonts.every(x=>x.fonts.length&&x.fonts.every(f=>f.isCustomFont)),'Every sampled glyph uses the intended webfonts, including CTA')
  const env=await page.evaluate(()=>({userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,devicePixelRatio},visualViewport:{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale},fontStatus:document.fonts.status,faces:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight,style:f.style,stretch:f.stretch,status:f.status})),resources:performance.getEntriesByType('resource').filter(r=>/\.(css|woff2)(?:\?|$)/.test(r.name)).map(r=>new URL(r.name).pathname)}))
  const resources=[];for(const path of env.resources){const response=await page.request.get(base+path);assert.equal(response.status(),200);const bytes=await response.body();resources.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')})}
  for(const state of ['Scattered','Connected']){await page.getByRole('button',{name:new RegExp(state)}).click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/dark-${width}-${state.toLowerCase()}.png`})}
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  results.push({browserVersion:browser.version(),node:process.version,platform:platform(),release:release(),arch:arch(),width,environment:env,ready,settled,fonts,resources,stable:true})
  await context.close()
 }
 console.log('PASS font metrics: actual CTA/body/display glyphs, resource hashes, explicit viewport/DPR, computed weights/axes and stable settled captures.')
}finally{writeFileSync(out+'/results.json',JSON.stringify(results,null,2));await browser.close()}
