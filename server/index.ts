import { createServer } from 'node:http'
import leadHandler from '../api/leads.ts'
import releaseHandler from '../api/release.ts'

const port = Number(process.env.PORT ?? 8787)
createServer((req, res) => {
  if ((req.url ?? '').split('?')[0] === '/api/leads') {
    void leadHandler(req, res)
  } else if ((req.url ?? '').split('?')[0] === '/api/release') {
    releaseHandler(req, res)
  } else { res.statusCode = 404; res.end('Not found') }
}).listen(port, () => console.log(`Pilot API listening on http://localhost:${port}`))
