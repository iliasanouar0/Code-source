const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTables = (request, response) => {
    let names = []
    sql = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`
    pool.query(sql, (err, res) => {
        if (err) {
            response.status(500).send(err.details)
        }
        res.rows.forEach(elm => {
            names.push(elm.tablename)
        })
    })
    response.send(names)
}

module.exports = {
    getTables,
}