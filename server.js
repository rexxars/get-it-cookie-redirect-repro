// Node.js server with vite for serving browser bundle
const express = require('express')
const {createServer: createViteServer} = require('vite')
const requestFromNode = require('./requestFromNode')

async function createServers() {
  const source = express()
  const target = express()

  const vite = await createViteServer({
    server: {middlewareMode: 'html'}
  })
  
  source.get('/cookie', (req, res) => {
    const hadCookie = (req.headers.cookie || '').includes('authToken=')
    res.status(200)
    res.type('text')
    res.cookie('authToken', 'secretValue', {path: '/', sameSite: 'lax', httpOnly: true})
    res.send(hadCookie ? 'Cookie already set\n' : 'Cookie successfully set\n')
  })
  
  source.get('/redirect', (req, res) => {
    const host = req.headers.host || 'localhost:3000'
    const same = host.replace(/:\d+/, '')
    const diff = host.startsWith('localhost') ? '127.0.0.1' : 'localhost'
    const url = `http://${req.query.diff ? diff : same}:3001`

    if (req.query.setCookie) {
      res.cookie('fromDirect', 'yep', {path: '/', sameSite: 'lax', httpOnly: true})
    }

    res.redirect(url)
  })

  source.use(vite.middlewares)
  
  target.options('*', (req, res) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-credentials', 'true')
    res.set('access-control-allow-methods', 'GET, POST, PUT, DELETE')
  })

  target.get('*', (req, res) => {
    res.type('text')
    if (req.headers.origin) {
      res.set('access-control-allow-origin', req.headers.origin)
      res.set('access-control-allow-credentials', 'true')
    }
    res.send(JSON.stringify({
      host: req.headers.host,
      cookie: req.headers.cookie || '<missing>'
    }, null, 2) + '\n')
  })

  return new Promise((resolve, reject) => {
    source.listen(3000, () => {
      target.listen(3001, resolve).on('error', reject)
    }).on('error', reject)
  })
}

createServers()
  .then(() => {
    console.log('Servers listening on :3000, :3001')
    console.log('Running tests from node.js:')
    return requestFromNode()
  })
  .then(() => {
    console.log('Done. Fire up your browser at http://localhost:3000/')
  })
  .catch(err => console.error(err))
