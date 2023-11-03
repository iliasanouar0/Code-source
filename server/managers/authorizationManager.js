const pg = require("pg");

const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const addIp = (req, res) => {
    let date = (req.body)
    res.status(200).send(date)
}

module.exports = {
    addIp,
}