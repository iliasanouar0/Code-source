const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


const addAccount = (req, res) => {
    let obj = (req.body)
    let sql = 'INSERT INTO cloudaccount (login, password) VALUES ($1,$2) RETURNING id'
    let values = [obj.login, obj.password]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Account added with id : ${r.rows[0].id}`)
    })
}

const editAccount = (req, res) => {
    let obj = (req.body)
    let sql = 'UPDATE cloudaccount SET password=$1 WHERE cloudaccount.id=$2'
    let values = [obj.password, obj.id]
    pool.query(sql, values, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Account updated with id : ${obj.id}`)
    })
}

const getAccounts = (req, res) => {
    let sql = 'SELECT * FROM cloudaccount'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const getAccountsById = (req, res) => {
    const id = (req.params.id)
    let sql = 'SELECT * FROM cloudaccount WHERE cloudaccount.id=$1'
    pool.query(sql, [id], (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const getAccountsData = (req, res) => {
    let sql = 'SELECT cloudaccount.*, COUNT(id_project) AS project_count FROM cloudaccount LEFT JOIN cloudproject ON cloudproject.id_account = cloudaccount.id GROUP BY cloudaccount.login, cloudaccount.password'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(r.rows)
    })
}

const deleteAccount = (req, res) => {
    let id = req.params.id
    let sql = 'DELETE FROM cloudaccount WHERE cloudaccount.id=$1'
    pool.query(sql, (e, r) => {
        if (e) {
            res.status(200).send({ name: e.name, message: e.message, stack: e.stack })
        }
        res.status(200).send(`Account deleted with id : ${id}`)
    })
}

module.exports = {
    addAccount,
    getAccounts,
    editAccount,
    getAccountsData,
    getAccountsById,
    deleteAccount
}