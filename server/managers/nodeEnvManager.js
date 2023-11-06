const fs = require('fs')
let dotenv = require('dotenv')

const getMode = (req, res) => {
    // let ip = req.socket.remoteAddress
    // res.status(200).send(ip)
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
    fs.writeFile('./.env', `NODE_ENV=${test}`, () => { console.log('done'); res.status(200).send(test); process.exit(1) })
}

module.exports = {
    getMode,
    setMode,
}