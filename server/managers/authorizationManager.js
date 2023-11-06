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

const getIpsServer = async () => {
    // if (mode == 'development') {
    //     let sql = 'SELECT ip FROM authorizedips'
    //     pool.query(sql, (e, r) => {
    //         if (e) {
    //             throw e.message
    //         }
    //         return r.rows
    //     })
    // }
    let sql = 'SELECT ip FROM authorizedips'
    const client = await pool.connect()
    const list = await client.query(sql)
    client.release()
    return list.rows;
}

const getIpById = (req, res) => {
    let id = (req.params.id)
    let sql = 'SELECT authorizedips.*,entity.nom FROM authorizedips JOIN entity ON entity.id_entity=authorizedips.entityid WHERE id=$1'
    pool.query(sql, [id], (e, r) => {
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

const editIp = (req, res) => {
    let data = (req.body)
    let sql = 'UPDATE authorizedips SET ip=($1),type=($2),status=($3),note=($4),entityid=($5),updatedat=(CURRENT_TIMESTAMP) WHERE id=($6)'
    let values = [data.ip, data.type, data.status, data.note, data.entity, data.id]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send(e.message)
        }
        res.status(200).send(`IP updated with ID: ${data.id}`)
    })
}

module.exports = {
    addIp,
    getIps,
    deleteIp,
    getIpById,
    editIp,
    getIpsServer
}