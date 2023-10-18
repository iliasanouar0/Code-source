const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const saveResult = (data) => {
    let sql = `INSERT INTO results (id_list, id_seeds, id_process, id_result, feedback, start_in, end_in) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_result`
    var generator = new IdGenerator({
        len: 4,
        alphabet: "1234567890"
    });
    let id = generator.get();
    let values = [data.id_list, data.id_seeds, data.id_process, id, data.feedback, data.start_in, data.end_in]
    pool.query(sql, values, (error, result) => {
        if (error) {
            return { name: error.name, stack: error.stack, message: error.message }
        }
        return result.rows[0].id_result
    })
}

module.exports = {
    saveResult,
}