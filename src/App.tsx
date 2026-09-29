import { PilotApp } from './prospect/PilotApp'
import { Privacy } from './prospect/Privacy'

export function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/privacy') return <Privacy />
  if (path && path !== '/') return <main className="p-frame"><h1>Page not available</h1><a href="/">Start a Game Plan</a></main>
  return <PilotApp />
}
