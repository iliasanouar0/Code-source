const pg = require("pg");

const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const addIp = (req, res) => {
    let data = (req.body)
    let sql = 'INSERT INTO authorizedips (ip,type,status,note,createdat,updatedat,entityid) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id'
    let values = [data.ip, data.type, data.status, data.note, data.created.toLocaleString(), data.updated, data.entity]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send(e.message)
        }
        res.status(200).send(`IP added with ID: ${r.rows[0].id}`)
    })
}

module.exports = {
    addIp,
}