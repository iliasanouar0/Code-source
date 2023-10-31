const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getTables = (request, response) => {
    let result = []
    let sql1 = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`
    // let sql = `SELECT tablename,information_schema.columns.table_name,information_schema.columns.column_name,information_schema.columns.data_type FROM pg_catalog.pg_tables JOIN information_schema.columns ON information_schema.columns.table_name=pg_catalog.pg_tables.tablename WHERE schemaname != 'pg_catalog' AND information_schema.columns.table_schema='public'`
    let sql2 = `SELECT  table_name,  column_name,  data_type  FROM  information_schema.columns WHERE table_name='users' GROUP BY table_name,columns.column_name,columns.data_type union SELECT tablename,tableowner,schemaname FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog'`


    let sql = `SELECT * FROM (SELECT tablename,tableowner,schemaname FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' GROUP BY pg_tables.tablename,pg_tables.schemaname,pg_tables.tableowner UNION SELECT  table_name,  column_name,  data_type  FROM  information_schema.columns GROUP BY columns.column_name,columns.table_name,columns.data_type) AS U`
    pool.query(sql2, (err, res) => {
        if (err) {
            response.status(500).send({ name: err.name, message: err.message, stack: err.stack })
        }
        response.send(res.rows)
    })
}

module.exports = {
    getTables,
}