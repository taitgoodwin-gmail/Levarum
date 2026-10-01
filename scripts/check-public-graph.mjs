import ts from 'typescript'
import { existsSync,readFileSync } from 'node:fs'
import { resolve,dirname,extname } from 'node:path'
const seen=new Set()
function walk(file){
 if(seen.has(file))return
 seen.add(file)
 if(/\/(admin|operator|server|api)\/|\/store\/submissions\.|\/domain\/catalog\./.test(file))throw new Error(`Private module reachable from public entry: ${file}`)
 const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,extname(file)==='.jsx'||extname(file)==='.tsx'?ts.ScriptKind.TSX:ts.ScriptKind.TS)
 function visit(n){
  let spec
  if(ts.isImportDeclaration(n)||ts.isExportDeclaration(n))spec=n.moduleSpecifier
  if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||n.expression.getText(source)==='require'))spec=n.arguments[0]
  if(spec&&ts.isStringLiteral(spec)){
   const name=spec.text
   if(/@clerk|@vercel\/blob|^pg$/.test(name))throw new Error(`Private SDK reachable from public entry: ${name}`)
   if(name.startsWith('.')){
    const base=resolve(dirname(file),name),path=[base,...['.ts','.tsx','.js','.jsx','/index.ts','/index.tsx'].map(e=>base+e)].find(p=>existsSync(p)&&/\.(tsx?|jsx?)$/.test(p))
    if(path)walk(path)
   }
  }
  ts.forEachChild(n,visit)
 }
 visit(source)
}
walk(resolve('src/main.tsx'))
console.log(`Public import boundary passed: ${seen.size} reachable modules; no admin, auth, private stores or server SDKs.`)
