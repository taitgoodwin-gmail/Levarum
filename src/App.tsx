import { ProspectApp } from './prospect/ProspectApp'
import { OperatorApp } from './operator/OperatorApp'
import { ROUTES, usePath } from './router'

/**
 * Two doors, one origin.
 *
 * The only thing this file does is pick a surface from the URL. There is no
 * shared shell, no nav, and no link between the two: the prospect surface
 * never renders a route into the console, so a prospect is never one tab away
 * from it. The console lives at /operator and is reached by typing it or by
 * the one quiet link in the footer.
 */
export function App() {
  const path = usePath()
  return path.startsWith(ROUTES.operator) ? <OperatorApp /> : <ProspectApp />
}
