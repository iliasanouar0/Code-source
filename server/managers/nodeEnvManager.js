const fs = require('fs')
let dotenv = require('dotenv')
const replace = require('replace-in-file');


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
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        process.exit(1)
    }
}

const grantAccess = (req, res) => {
    let access = (req.body)
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }

    let granted = `${access.entity}`
    let options = {
        files: '.env',
        from: /SERVER_ENTITY=\w+/g,
        to: `SERVER_ENTITY=${granted}`,
    }
    try {
        const results = replace.sync(options);
        console.log('Replacement results:', results);
        res.status(200).send(granted)
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

const getAccessGranted = (req, res) => {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    let string = result.parsed.SERVER_ENTITY
    res.status(200).send([{ entity: string }])
}

module.exports = {
    getMode,
    setMode,
    grantAccess,
    getAccessGranted
}