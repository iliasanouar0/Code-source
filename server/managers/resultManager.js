const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const saveResult = async (data) => {
    let sql = `INSERT INTO results (id_list, id_seeds, id_process, feedback, start_in, end_in, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`
    let values = [data.id_list, data.id_seeds, data.id_process, data.feedback, data.start_in, data.end_in, data.status]
    const client = await pool.connect()
    client.query(sql, values, (err) => {
        if (err) {
            throw err;
        }
        client.release()
        return true
    })
}

const endNow = async (data) => {
    let sql = 'UPDATE results SET end_in=($1) WHERE id_seeds=($2) AND id_process=($3)'
    let value = [data.end_in, data.id_seeds, data.id_process]
    const client = await pool.connect()
    client.query(sql, value, (err) => {
        if (err) {
            return err;
        }
        client.release()
        return true
    })
}

const saveFeedback = async (data) => {
    let sql = `UPDATE results SET feedback=($1) WHERE id_seeds=($2) AND id_process=($3)`
    let values = [data.feedback, data.id_seeds, data.id_process]
    const client = await pool.connect()
    client.query(sql, values, (err) => {
        if (err) {
            return err;
        }
        client.release()
        return true
    })
}

const saveDetails = async (data) => {
    let sql = `UPDATE results SET statusdetails=($1) WHERE id_seeds=($2) AND id_process=($3)`
    let values = [data.details, data.id_seeds, data.id_process]
    const client = await pool.connect()
    client.query(sql, values, (err) => {
        if (err) {
            return err;
        }
        client.release()
        return true
    })
}

const getFeedback = (request, response) => {
    let id = (request.params.id)
    let id_process = (request.query.id_process)
    sql = `SELECT feedback FROM results WHERE id_seeds=($1) AND id_process=($2)`
    pool.query(sql, [id, id_process], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        response.status(200).send(result.rows)
    })
}

function msToMnSc(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
}

const deleteResults = async (id) => {
    let sql = "DELETE FROM results WHERE id_seeds=($1)"
    pool.query(sql, [id], (err, res) => {
        if (err) {
            throw err
        }
    })
}

const deleteResultsProcess = async (id) => {
    let sql = "DELETE FROM results WHERE id_process=($1)"
    pool.query(sql, [id], (err, res) => {
        if (err) {
            throw err
        }
    })
}

const getDuration = (request, response) => {
    let id = (request.params.id)
    sql = `SELECT start_in, end_in FROM results where id_seeds=($1)`
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        if (result.rowCount == 0 || result.rows[0].end_in == '0') {
            response.status(200).send({ duration: '00:00:00' })
        }
        let start = new Date(result.rows[0].start_in)
        let end = new Date(result.rows[0].end_in)
        let duration = msToMnSc(end - start)
        response.status(200).send({ duration: duration })
    })
}

const updateState = async (data, state) => {
    let query = []
    for (let i = 0; i < data.length; i++) {
        query.push([data[i].id_seeds, data[i].id_process, state])
    }
    const sql = `UPDATE results SET status=($3) WHERE id_seeds=($1) AND id_process=($2)`
    query.forEach(async (elm) => {
        const client = await pool.connect()
        client.query(sql, elm, (err) => {
            if (err) {
                throw err;
            }
        });
        client.release()
    })
}

const startNow = async (data) => {
    let start_in = new Date()
    const sql = `UPDATE results SET start_in=($3) WHERE id_seeds=($1) AND id_process=($2)`
    const client = await pool.connect()
    client.query(sql, [data.id_seeds, data.id_process, start_in], (err) => {
        if (err) {
            throw err;
        }
        client.release()
    });
}

module.exports = {
    saveResult,
    endNow,
    getFeedback,
    getDuration,
    deleteResults,
    deleteResultsProcess,
    updateState,
    startNow,
    saveFeedback, saveDetails
}