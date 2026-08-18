import { useEffect, useState } from 'react'
import { ProspectApp } from './prospect/ProspectApp'
import { OperatorApp } from './operator/OperatorApp'

/**
 * Two doors, one origin.
 *
 * The only thing this file does is pick a surface from the URL. There is no
 * shared shell, no nav, and no link between the two: the prospect surface
 * never renders a route into the console, so a prospect is never one tab away
 * from it. The console lives at /operator and is reached by typing it.
 */
const OPERATOR_PATH = '/operator'

export function App() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return path.startsWith(OPERATOR_PATH) ? <OperatorApp /> : <ProspectApp />
}
