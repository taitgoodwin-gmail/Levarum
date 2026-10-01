import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173'
const out=process.env.TEST_OUT||'work/fonts'
mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const results=[],errors=[]
try {
 for(const theme of ['light','dark'])for(const width of [320,390,768,1440])for(const path of ['/','/contact']){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'})
  await context.addInitScript(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
  const page=await context.newPage(),requests=[],failed=[]
  page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failed.push(r.url()));page.on('pageerror',e=>errors.push(e.message))
  // External services cannot mask a broken self-hosted setup.
  await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort())
  await page.goto(base+path);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready)
  const client=await context.newCDPSession(page)
  await client.send('DOM.enable');await client.send('CSS.enable')
  const {root}=await client.send('DOM.getDocument')
  const rendered=[]
  for(const [selector,family] of [['h1','Schibsted Grotesk'],[path==='/'?'.lv-r2-intro':'.lv-lead','Instrument Sans']]){
   const {nodeId}=await client.send('DOM.querySelector',{nodeId:root.nodeId,selector})
   const {fonts}=await client.send('CSS.getPlatformFontsForNode',{nodeId})
   assert.ok(fonts.some(f=>f.isCustomFont&&f.familyName===family&&f.glyphCount>0),`${path}/${theme}/${width}: actual ${family} glyphs`)
   assert.ok(fonts.every(f=>f.isCustomFont),`${selector}: no fallback glyphs for the page's primary text`)
   rendered.push({selector,fonts})
  }
  const fontResources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.woff2')).map(r=>({url:new URL(r.name).pathname,bytes:r.encodedBodySize,duration:r.duration})))
  assert.ok(fontResources.length>=2);assert.ok(fontResources.every(r=>r.bytes>0))
  assert.equal(requests.some(url=>/fonts\.(googleapis|gstatic)\.com/.test(url)),false)
  assert.deepEqual(failed,[])
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  if([390,1440].includes(width))await page.screenshot({path:`${out}/${theme}-${width}-${path==='/'?'home':'contact'}.png`,fullPage:true})
  results.push({theme,width,path,rendered,fontResources,noExternalRequests:true,noOverflow:true})
  await context.close()
 }
 // Exercise the supplied weight, italic and extended-Latin files directly.
 const admin=await browser.newPage()
 await admin.goto(base+(process.env.TEST_ADMIN_ROUTE||'/admin.html'));await admin.locator('h1').waitFor();await admin.evaluate(()=>document.fonts.ready)
 const adminClient=await admin.context().newCDPSession(admin)
 await adminClient.send('DOM.enable');await adminClient.send('CSS.enable')
 const {root:adminRoot}=await adminClient.send('DOM.getDocument')
 const {nodeId:adminHeading}=await adminClient.send('DOM.querySelector',{nodeId:adminRoot.nodeId,selector:'h1'})
 const {fonts:adminFonts}=await adminClient.send('CSS.getPlatformFontsForNode',{nodeId:adminHeading})
 assert.ok(adminFonts.some(f=>f.isCustomFont&&f.familyName==='Schibsted Grotesk'&&f.glyphCount>0))
 writeFileSync(out+'/admin-fonts.json',JSON.stringify(adminFonts,null,2));await admin.close()
 const context=await browser.newContext(),page=await context.newPage()
 await page.goto(base+'/contact');await page.locator('h1').waitFor()
 const faces=await page.evaluate(async()=>{
  const requests=[['Schibsted Grotesk Variable',700,'normal'],['Instrument Sans Variable',400,'normal'],['Instrument Sans Variable',500,'italic']]
  const faces=[]
  for(const [family,weight,style] of requests){const loaded=await document.fonts.load(`${style} ${weight} 24px "${family}"`,'Łódź Český café');faces.push({family,weight,style,loaded:loaded.map(face=>({family:face.family,status:face.status,weight:face.weight,style:face.style}))})}
  return faces
 })
 assert.ok(faces.every(f=>f.loaded.length>0&&f.loaded.every(x=>x.status==='loaded')))
 for(const family of ['schibsted-grotesk','instrument-sans']){
  const response=await page.request.get(base+`/fonts/${family}-OFL.txt`)
  assert.equal(response.status(),200);assert.match(await response.text(),/SIL OPEN FONT LICENSE Version 1.1/)
 }
 await context.close()
 assert.deepEqual(errors,[])
 writeFileSync(out+'/faces.json',JSON.stringify(faces,null,2))
 console.log(`PASS: ${results.length} desktop/mobile/theme Home and Contact renders use actual intended webfont glyphs; admin setup heading, local WOFF2 requests, italic/extended Latin and served licenses verified. External requests blocked throughout visual matrix.`)
}finally{writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));await browser.close()}
