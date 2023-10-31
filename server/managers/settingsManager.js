const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTables = (request, response) => {
    let result = []
    let sql = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`
    let data = `SELECT  table_name,  column_name,  data_type  FROM  information_schema.columns WHERE  table_name = $1`
    pool.query(sql, (err, res) => {
        if (err) {
            response.status(500).send(err.details)
        }
        response.send(res.rows)
    })
}

module.exports = {
    getTables,
}