const fs = require('fs')
let dotenv = require('dotenv')
const replace = require('replace-in-file');

const result = dotenv.config()
if (result.error) {
  throw result.error
}
let mode = result.parsed.NODE_ENV
let test = mode == "development" ? "production" : "development"
// fs.writeFile('./.env', `NODE_ENV=${test}`, () => { console.log('done'); res.status(200).send(test); process.exit(1) })
let options
if (test == "development") {
  options = {
    files: '.env',
    from: /NODE_ENV=production/g,
    to: `NODE_ENV=${test}`,
  }
} else {
  options = {
    files: '.env',
    from: /NODE_ENV=development/g,
    to: `NODE_ENV=${test}`,
  }
}
try {
  const results = replace.sync(options);
  console.log('Replacement results:', results);
  res.status(200).send(test)
}
catch (error) {
  console.error('Error occurred:', error);
} /*finally {
    process.exit(1)
}*/