const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTablesNames = (request, response) => {
    let sql = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`
    pool.query(sql, (err, res) => {
        if (err) {
            response.status(500).send({ name: err.name, message: err.message, stack: err.stack })
        }
        response.send(res.rows)
    })
}

const getTableColumns = (request, response) => {
    let table = (request.params.t)
    let sql = `SELECT table_name,column_name,  data_type  FROM  information_schema.columns WHERE table_name=($1)`
    pool.query(sql, [table], (err, res) => {
        if (err) {
            response.status(500).send({ name: err.name, message: err.message, stack: err.stack })
        }
        response.send(res.rows)
    })
}

const createTable = (request, response) => {
    let sql = (request.body)
    response.status(200).send(sql)
}

module.exports = {
    getTablesNames,
    getTableColumns,
    createTable
}