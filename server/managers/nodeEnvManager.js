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
    // try {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    let mode = result.parsed.NODE_ENV
    let test = mode == "development" ? "production" : "development"
    res.status(200).send(test)
    fs.writeFile('./.env', `NODE_ENV=${test}`, process.exit(1))
    // } catch (error) {
    //     throw error
    // } finally {
    //     process.exit(1)
    // }
}

module.exports = {
    getMode,
    setMode,
}