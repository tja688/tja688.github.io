import { createServer } from 'node:http'
import { existsSync, realpathSync, statSync, createReadStream } from 'node:fs'
import { resolve, relative, extname, join, isAbsolute } from 'node:path'

const args = process.argv.slice(2)
if (!args[0] || args[0].startsWith('--')) {
  console.error('Usage: node preview.mjs <game-directory> [--port 4186]')
  process.exit(1)
}
const root = realpathSync(resolve(args[0]))
const portIndex = args.indexOf('--port')
const port = Number(portIndex >= 0 ? args[portIndex + 1] : 4186)
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Choose a port between 1024 and 65535')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webm': 'video/webm',
  '.wav': 'audio/wav',
}
const inside = (path) => {
  const part = relative(root, path)
  return (
    !isAbsolute(part) &&
    part !== '..' &&
    !part.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)
  )
}
const server = createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405)
    response.end()
    return
  }
  let path
  try {
    path = resolve(
      root,
      `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`,
    )
  } catch {
    response.writeHead(400)
    response.end()
    return
  }
  if (!inside(path) || !existsSync(path)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }
  path = realpathSync(path)
  if (!inside(path)) {
    response.writeHead(403)
    response.end()
    return
  }
  if (statSync(path).isDirectory()) path = join(path, 'index.html')
  if (!existsSync(path) || !statSync(path).isFile()) {
    response.writeHead(404)
    response.end('Not found')
    return
  }
  if (!inside(realpathSync(path))) {
    response.writeHead(403)
    response.end()
    return
  }
  response.writeHead(200, {
    'Content-Type': types[extname(path)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  })
  if (request.method === 'HEAD') {
    response.end()
    return
  }
  createReadStream(path).pipe(response)
})
server.listen(port, '127.0.0.1', () =>
  console.log(`Pixel-ink preview: http://127.0.0.1:${port}/`),
)
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => server.close(() => process.exit(0)))
