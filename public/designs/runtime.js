// Small adapter for the archived design export. Expressions are property paths,
// never executable strings. This runtime has no network or live-data access.
export class DCLogic {
 props={}; state={};
 setState(patch){Object.assign(this.state,typeof patch==='function'?patch(this.state):patch);this.refresh?.()}
}
function value(expr,scope){
 const path=expr.trim();if(path==='true')return true;if(path==='false')return false;
 if(!/^[\w.]+$/.test(path))throw new Error(`Unsupported design expression: ${path}`)
 return path.split('.').reduce((v,k)=>k==='__proto__'||k==='constructor'?undefined:v?.[k],scope)
}
function resolve(text,scope){const m=text.match(/^\s*{{\s*([^}]+)\s*}}\s*$/);return m?value(m[1],scope):text.replace(/{{\s*([^}]+)\s*}}/g,(_,e)=>String(value(e,scope)??''))}
function draw(node,scope,path='0'){
 if(node.nodeType===3)return document.createTextNode(resolve(node.textContent,scope)??'')
 const out=document.createDocumentFragment();if(node.nodeType!==1)return out;
 const tag=node.tagName.toLowerCase();
 if(tag==='sc-if'){if(resolve(node.getAttribute('value'),scope))for(const [i,c]of [...node.childNodes].entries())out.append(draw(c,scope,path+'.'+i));return out}
 if(tag==='sc-for'){for(const [i,item]of (resolve(node.getAttribute('list'),scope)||[]).entries())for(const [j,c]of [...node.childNodes].entries())out.append(draw(c,{...scope,[node.getAttribute('as')]:item},path+'.'+i+'.'+j));return out}
 const el=document.createElement(tag);el.dataset.previewKey=path;
 for(const a of node.attributes){
  const v=resolve(a.value,scope);
  if(a.name.startsWith('hint-'))continue;
  if(a.name==='ref'){if(v)v.current=el;continue}
  if(a.name.startsWith('on')){
   if(typeof v==='function'){el.addEventListener(a.name.slice(2),v);if(a.name==='onclick'&&!['button','a'].includes(tag)){el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();v(e)}})}}continue;
  }
  if(a.name==='style'&&typeof v==='object'){Object.assign(el.style,v);continue}
  if(a.name==='value'){el.value=v;el.setAttribute('value',v);continue}
  el.setAttribute(a.name,String(v??''));
 }
 for(const [i,c] of [...node.childNodes].entries())el.append(draw(c,scope,path+'.'+i));
 return el;
}
export function mount(Component,slug){
 const root=document.querySelector('#design-root'),tpl=document.querySelector('#design-template');
 const app=new Component(); const params=new URLSearchParams(location.search);
 const states=['door','step1','step2','step3','gate','reveal','booking','confirmed','oplogin','console'];
 function render(){
  const focus=document.activeElement,key=focus?.dataset.previewKey,selection=focus?.selectionStart;
  const scope=app.renderVals(),fragment=document.createDocumentFragment();
  for(const [i,c]of [...tpl.content.childNodes].entries())fragment.append(draw(c,scope,String(i)));
  root.replaceChildren(fragment);app.componentDidUpdate?.();
  if(key){const target=[...root.querySelectorAll('[data-preview-key]')].find(e=>e.dataset.previewKey===key);target?.focus({preventScroll:true});if(selection!=null&&target?.type!=='range')try{target.setSelectionRange(selection,selection)}catch{}}
 }
 app.refresh=render;render();app.componentDidMount?.();
 if(slug.startsWith('prototype')){
  const nav=document.querySelector('#screens');
  const routes=[...states,...(slug==='prototype-v2'?['detail']:[])];
  const names=['Start','Intake 1','Intake 2','Intake 3','Email gate','Game Plan','Booking demo','Confirmation','Sign-in demo','Operator demo','Workflow detail'];
  routes.forEach((r,i)=>{const a=document.createElement('a');a.href=`?screen=${r}`;a.textContent=names[i];nav.append(a)})
  const requested=params.get('screen');
  if(routes.includes(requested)){app.state.route=requested==='detail'?'console':requested;if(requested==='detail'){app.state.consoleView='detail';app.state.currentId=app.state.submissions[0]?.id}render()}
  for(const field of ['spark','voice','density'])document.getElementById(field).addEventListener('change',e=>{
   const palette={ember:['#D4622A','#B5511F'],blue:['#2A6FDB','#1E4FA8'],forest:['#2F8F5B','#1F6B43'],violet:['#7A4DD6','#5A35A6']};app.props[field]=field==='spark'?palette[e.target.value]:e.target.value;render()
  });
  if(params.has('all')){
   app.refresh=()=>{};root.replaceChildren();root.classList.add('storyboard');
   for(const [i,r]of routes.entries()){
    app.state.route=r==='detail'?'console':r;app.state.consoleView=r==='detail'?'detail':'inbox';app.state.currentId=app.state.submissions?.[0]?.id;
    const section=document.createElement('section');section.className='storyboard-screen';const h=document.createElement('h2');h.textContent=names[i];section.append(h);
    const scope=app.renderVals();for(const [j,c]of [...tpl.content.childNodes].entries())section.append(draw(c,scope,String(j)));
    // Only the actual phone frame belongs in the storyboard; omit repeated poster and notes.
    const wrapper=section.querySelector('div');if(wrapper){const phone=[...wrapper.children].find(e=>e.style.width==='390px');if(phone){phone.inert=true;section.append(phone);wrapper.remove()}}
    root.append(section);
   }
   document.querySelector('#screens').hidden=true;document.querySelector('.tweaks').hidden=true;
  }
 }
 if(location.hostname==='127.0.0.1'||location.hostname==='localhost'){
  if(location.hash.includes('figmacapture=')){const script=document.createElement('script');script.src='https://mcp.figma.com/mcp/html-to-design/capture.js';script.async=true;document.head.append(script)}
 }
}
