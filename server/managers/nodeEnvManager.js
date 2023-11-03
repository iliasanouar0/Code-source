const fs = require('fs')
let dotenv = require('dotenv')

// let mode = process.env.NODE_ENV

// let test = mode == "development" ? "production" : "development"

// fs.writeFile('./.env', `NODE_ENV=${test}`, function () { console.log('done') })


const getMode = (req, res) => {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    res.status(200).send(result.parsed.NODE_ENV)
}

module.exports = {
    getMode,
}