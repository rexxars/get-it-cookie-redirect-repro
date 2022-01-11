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

async function requestFromNode() {
  try {
    // With redirect
    console.log(`GET ${baseUrl}/redirect?diff=host => ${target}/`)
    console.log('(expect no cookie, since it is after a redirect to different host)')

    let response = await request({url: '/redirect?diff=host', withCredentials: true, headers})
    console.log(response.body)

    // Without redirect
    console.log(`GET ${target}/`)
    console.log('(expect a cookie, since it is a direct request)')
    response = await request({url: `${target}/`, withCredentials: true, headers})
    console.log(response.body)

    // With redirect, and cookie set in redirect response
    console.log(`GET ${baseUrl}/redirect?diff=host&setCookie=true => ${target}/`)
    console.log('(expect no cookie, since it is after a redirect to different host)')
    response = await request({url: '/redirect?diff=host&setCookie=true', withCredentials: true, headers})
    console.log(response.body)
  } catch (err) {
    console.error(err)
  }
}

if (require.main === module) {
  requestFromNode()
}

module.exports = requestFromNode
