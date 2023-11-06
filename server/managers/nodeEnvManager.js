const fs = require('fs')
let dotenv = require('dotenv')

const getMode = (req, res) => {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    res.status(200).send(result.parsed.NODE_ENV)
}

const setMode = (req, res) => {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    let mode = result.parsed.NODE_ENV
    let test = mode == "development" ? "production" : "development"
    fs.writeFile('./.env', `NODE_ENV=${test}`,()=>{console.log('done');})
}

module.exports = {
    getMode,
    setMode,
}