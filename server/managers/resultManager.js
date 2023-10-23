const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const saveResult = async (data) => {
    let sql = `INSERT INTO results (id_list, id_seeds, id_process, id_result, feedback, start_in, end_in) VALUES ($1, $2, $3, $4, $5, $6, $7)`
    var generator = new IdGenerator({
        len: 4,
        alphabet: "1234567890"
    });
    let id = generator.get();
    let values = [data.id_list, data.id_seeds, data.id_process, id, data.feedback, data.start_in, data.end_in]
    const client = await pool.connect()
    client.query(sql, values, (err) => {
        if (err) {
            throw err;
        }
        client.release()
        return true
    })
}

const updateResult = async (data) => {
    sql = 'UPDATE results SET feedback=($1) ,end_in=($2) WHERE id_seeds=($3)'
    let value = [data.feedback, data.end_in, data.id_seeds]
    const client = await pool.connect()
    client.query(sql, value, (err) => {
        if (err) {
            return err;
        }
        client.release()
        return true
    })
}

const getFeedback = (request, response) => {
    let id = (request.params.id)
    sql = `SELECT feedback FROM results WHERE id_seeds=($1)`
    pool.query(sql, [id], (error, result) => {
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

module.exports = {
    saveResult,
    updateResult,
    getFeedback,
    getDuration
}