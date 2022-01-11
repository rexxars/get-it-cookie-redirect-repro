// Browser entry point
import getIt from 'get-it' 
import base from 'get-it/lib/middleware/base'
import promise from 'get-it/lib/middleware/promise'

const request = getIt([
  base(window.location.origin),
  promise()
])

const logEl = document.getElementById('log')
const log = (msg) => logEl.innerText = logEl.innerText + msg + '\n'

document.getElementById('set-cookie').addEventListener('click', () => {
  log('GET ' + window.location.origin + '/cookie')
  request({url: '/cookie', withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
    .then(() => {
      document.querySelectorAll('button[disabled]').forEach(el => el.disabled = false)
    })
})

document.getElementById('redirect-request').addEventListener('click', () => {
  log('GET ' + window.location.origin + '/redirect')
  log('(expect cookie, since it is the same host, different port)')
  request({url: '/redirect', withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('set-cookie-redirect-request').addEventListener('click', () => {
  log('GET ' + window.location.origin + '/redirect?setCookie=true')
  log('(expect cookie, since it is the same host, different port)')
  request({url: '/redirect?setCookie=true', withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('redirect-request-diff-host').addEventListener('click', () => {
  log('GET ' + window.location.origin + '/redirect?diff=host')
  log('(expect no cookie, since it is different host)')
  request({url: '/redirect/?diff=host', withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('set-cookie-redirect-request-diff-host').addEventListener('click', () => {
  log('GET ' + window.location.origin + '/redirect?diff=host&setCookie=true')
  log('(expect no cookie, since it is different host)')
  request({url: '/redirect/?diff=host&setCookie=true', withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('direct-request').addEventListener('click', () => {
  const host = window.location.hostname || 'localhost'
  const url = `http://${host}:3001`
  
  log('GET ' + url)
  log('(expect cookie, since it is same host, different port)')
  request({url, withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('direct-request-diff-host').addEventListener('click', () => {
  const host = window.location.hostname || 'localhost'
  const diff = host.startsWith('localhost') ? '127.0.0.1' : 'localhost'
  const url = `http://${diff}:3001`
  
  log('GET ' + url)
  log('(expect no cookie, since it is different host)')
  request({url, withCredentials: true})
    .then(response => log(response.body))
    .catch(err => console.error(err))
})

document.getElementById('app').style.display = 'block'