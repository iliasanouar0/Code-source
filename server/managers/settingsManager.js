const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTables = (request, response) => {
    sql = `SELECT tablename,information_schema.columns.column_name,information_schema.columns.data_type FROM pg_catalog.pg_tables JOIN information_schema ON information_schema.table_name=pg_catalog.pg_tables.tablename WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`
    pool.query(sql, (err, res) => {
        if (err) {
            response.status(500).send(err.details)
        }
        response.status(200).send(res.rows)
    })
}

module.exports = {
    getTables,
}