// Code firing off HTTP requests from node.js using get-it
const getIt = require('get-it')
const base = require('get-it/lib/middleware/base')
const promise = require('get-it/lib/middleware/promise')

const baseUrl = 'http://localhost:3000'
const target = baseUrl.replace('3000', '3001')
const request = getIt([
  base(baseUrl),
  promise()
])

const headers = {cookie: 'authToken=fromNode'}

function requestFromNode() {
  return request({url: '/redirect', withCredentials: true, headers})
    .catch(err => console.error(err))
    .then(response => {
      console.log(`GET ${baseUrl}/redirect => ${target}/`)
      console.log('(expect no cookie, since it is after a redirect to different host)')
      console.log(response.body)
    })
    .then(() => request({url: `${target}/`, withCredentials: true, headers}))
    .catch(err => console.error(err))
    .then(response => {
      console.log(`GET ${target}/`)
      console.log('(expect a cookie, since it is a direct request)')
      console.log(response.body)
    })
}

if (require.main === module) {
  requestFromNode()
}

module.exports = requestFromNode
