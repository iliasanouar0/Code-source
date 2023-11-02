let dotenv = require('dotenv')
const result = dotenv.config()
process.env.NODE_ENV = "production"
if (result.error) {
  throw result.error
}

console.log(result.parsed)
