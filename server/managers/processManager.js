const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const format = require("pg-format");
const { request, response } = require("express");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const addProcess = (request, response) => {
    const obj = (request.body)
    let pattern = getRndInteger(100000000, 99999999999999);
    var generator = new IdGenerator({
        len: 4,
        alphabet: `${pattern}` /*prefix: id_entity, separator: ' '*/,
    });
    let id = generator.get();
    let sql = `INSERT INTO process ( id_process, name ,action ,status ,date_add ,date_update,id_list ,id_user) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id_process`
    let data = [id, obj.name, obj.action, obj.status, obj.date_add, obj.date_update, obj.id_list, obj.id_user]
    // response.status(200).send({ sql: sql, data: data })
    pool.query(sql, data, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        response.status(200).send(`Process added with ID : ${result.rows[0].id_process}`)
    })
}

const getAllData = (request, response) => {
    let sql = "SELECT process.*,list.name AS list_name,list.isp,users.f_name, users.l_name, COUNT(id_seeds) AS count FROM process JOIN list ON list.id_list=process.id_list JOIN users ON process.id_user=users.id_user JOIN seeds ON seeds.id_list=process.id_list GROUP BY process.id_process,list.id_list,users.id_user"
    pool.query(sql, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}
/**
 * @param {Object} data 
 * @returns
 */
const updateProcess = (data) => {
    // let results = ""
    // let query = "UPDATE process SET status=($1), start_in=($2) WHERE id_process=($3)"
    // let values = [data.status, data.start_in, data.id_process]
    // let obj = { query: query, data: values }
    // pool.query(obj.query, obj.data, (error, result) => {
    //     if (error) {
    //         console.log({ name: error.name, stack: error.stack, message: error.message, error: error })
    //         return
    //     }
    //     results = 'Process started successfully'
    // })
    return data
}

// const updateProcess = (request, response) => {
//     const data = request.body
//     let query = "UPDATE process SET status=($1), start_in=($2) WHERE id_process=($3)"
//     let values = [data.status, data.start_in, data.id_process]
//     let obj = { query: query, data: values }
//     pool.query(obj.query, obj.data, (error, result) => {
//         if (error) {
//             response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
//         }
//         response.status(200).send('Process started successfully')
//     })
// }

module.exports = {
    addProcess,
    getAllData,
    updateProcess,
}