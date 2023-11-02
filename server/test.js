const fs = require('fs')
let dotenv = require('dotenv')

const result = dotenv.config()
let mode = process.env.NODE_ENV

let test = mode == "development" ? "production" : "development"

console.log(mode);
if (result.error) {
  throw result.error
}

fs.writeFile('./.env', '', function () { console.log('done') })
fs.writeFile('./.env', `NODE_ENV=${test}`, function () { console.log('done') })

console.log(result.parsed)
