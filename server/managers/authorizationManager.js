const pg = require("pg");

const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const addIp = (req, res) => {
    let data = (req.body)
    let sql = 'INSERT INTO authorizedips (ip,type,status,note,entityid) VALUES($1,$2,$3,$4,$5) RETURNING id'
    let values = [data.ip, data.type, data.status, data.note, data.entity]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send(e.message)
        }
        res.status(200).send(`IP added with ID: ${r.rows[0].id}`)
    })
}

const getIps = (req, res) => {
    let sql = 'SELECT authorizedips.*,entity.nom FROM authorizedips JOIN entity ON entity.id_entity=authorizedips.entityid'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send(e.message)
        }
        res.status(200).send(r.rows)
    })
}

const deleteIp = (request, response) => {
    const ides = (request.body);
    const sql = "DELETE FROM authorizedips WHERE id=$1";
    const params = [];
    for (let i = 0; i < ides.length; i++) {
        params.push([ides[i]])
    }
    params.forEach(param => {
        pool.query(sql, param, (err, result) => {
            if (err) { response.status(409).send(err) } else { console.log(`records deleted`) }
        });
    });
    response.status(200).send('ip deleted');
}

module.exports = {
    addIp,
    getIps,
    deleteIp
}