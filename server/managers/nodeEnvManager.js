const fs = require('fs')
let dotenv = require('dotenv')

// let mode = process.env.NODE_ENV

// let test = mode == "development" ? "production" : "development"

// console.log(mode);
// if (result.error) {
//     throw result.error
// }

// fs.writeFile('./.env', `NODE_ENV=${test}`, function () { console.log('done') })

// console.log(result.parsed)

const getMode = (req, res) => {
    // const result = dotenv.config()
    let mode = process.env.NODE_ENV
    res.status(200).send(mode)
}

module.exports = {
    getMode,
}