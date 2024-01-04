const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const addProject = (req, res) => {
    let data = (req.body)
    let sql = 'INSERT INTO cloudproject (id_account,name,client_id,client_secret,redirect_url,scope) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_project'
    let values = []
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Project Added with ID : ${r.rows[0].id_project}`)
    })
}



// id_project
// id_account
// name
// client_id
// client_secret
// redirect_url
// scope


module.exports = {
    addProject,
}