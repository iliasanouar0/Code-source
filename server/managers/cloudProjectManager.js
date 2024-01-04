const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');
const { id } = require("translate-google/languages");

let config = data.data

const pool = new pg.Pool(config);


const addProject = (req, res) => {
    let data = (req.body)
    let sql = 'INSERT INTO cloudproject (id_account,name,client_id,client_secret,redirect_url,scope) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_project'
    let values = [data.account, data.name, data.client_id, data.client_secret, data.redirect_url, data.scope]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Project Added with ID : ${r.rows[0].id_project}`)
    })
}

const getProjects = (req, res) => {
    let sql = 'SELECT * FROM cloudproject'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const getProjectById = (req, res) => {
    let id = req.params.id
    let sql = 'SELECT * FROM cloudproject WHERE cloudproject.id_project=$1'
    pool.query(sql, [id], (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const getProjectsData = (req, res) => {
    let sql = 'SELECT cloudproject.*, cloudaccount.login FROM cloudproject JOIN cloudaccount ON cloudproject.id_account=cloudaccount.id'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const deleteProject = (req, res) => {
    let id = req.params.id
    let sql = 'DELETE FROM cloudproject WHERE cloudproject.id_project=$1'
    pool.query(sql, [id], (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Account deleted with id : ${id}`)
    })
}

const editProject = (req, res) => {
    let data = (req.body)
    let sql = 'UPDATE cloudproject SET client_id=$2, client_secret=$3, redirect_url=$4, scope=$5 WHERE id_project=$1'
    let values = [data.id_project, data.client_id, data.client_secret, data.redirect_url, data.scope]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Project Updated with ID : ${data.id_project}`)
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
    getProjects,
    getProjectById,
    getProjectsData,
    deleteProject,
    editProject
}