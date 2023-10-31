const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTables = (request, response) => {
    let result = []
    // let sql = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog'`
    let sql = `SELECT tablename,information_schema.columns.table_name,information_schema.columns.column_name,information_schema.columns.data_type FROM pg_catalog.pg_tables JOIN information_schema.columns ON information_schema.columns.table_name=pg_catalog.pg_tables.tablename WHERE schemaname != 'pg_catalog' AND information_schema.columns.table_schema='public' GROUP BY table_name, pg_tables.tablename,columns.column_name,columns.data_type`
    let data = `SELECT  *  FROM  information_schema.columns`
    // let data = `SELECT  table_name,  column_name,  data_type  FROM  information_schema.columns `
    pool.query(sql, (err, res) => {
        if (err) {
            response.status(500).send({ name: err.name, message: err.message, stack: err.stack })
        }
        response.send(res.rows)
    })
}

module.exports = {
    getTables,
}