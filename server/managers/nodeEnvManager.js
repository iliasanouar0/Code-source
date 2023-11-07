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
    // fs.writeFile('./.env', `NODE_ENV=${test}`, () => { console.log('done'); res.status(200).send(test); process.exit(1) })
    const options = {
        files: './.env',
        from: `/NODE_ENV=${mode}/g`,
        to: `NODE_ENV=${test}`,
    };
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
}

module.exports = {
    getMode,
    setMode,
}