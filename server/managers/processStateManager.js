const pg = require("pg");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const addState = (data) => {
    let values = [data.waiting, data.active, data.finished, data.failed, data.id_process]
    let sql = 'INSERT INTO processstate (waiting, active, finished, failed, id_process) VALUES ($1,$2,$3,$4,$5)'
    pool.query(sql, values, (error, result) => {
        if (error) {
            return error
        }
        return true
    })
}

const getState = async (id) => {
    const pool = new pg.Pool(config);
    let sql = 'SELECT * FROM processstate WHERE id_process=($1)'
    let data = [id]
    // const client = await pool.connect()
    // const list = await client.query(sql, data);
    // await client.end()
    // return list.rows;
    const results = pool.connect().then(client => {
        return client.query(sql, data)
    }).then(list => {
        return list.rows
    })
    pool.end()
    // pool.query(sql, data, (err, result) => {
    //     if (err) {
    //         throw err
    //     }
    //     return result.rows
    // })
    return results
}

const updateState = (data) => {
    let values = [data.waiting, data.active, data.finished, data.failed, data.id_process]
    let sql = 'UPDATE processstate SET waiting=($1), active=($2), finished=($3), failed=($4) WHERE id_process=($5)'
    pool.query(sql, values, (error, result) => {
        if (error) {
            return error
        }
        return true
    })
}

module.exports = {
    addState,
    getState,
    updateState
}