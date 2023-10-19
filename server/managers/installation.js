const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const createTables = (request, response) => {
    let tables = `CREATE TABLE IF NOT EXISTS entity ( Id_entity SERIAL NOT NULL, nom VARCHAR(50), status VARCHAR(50), date_add DATE, date_update DATE, PRIMARY KEY (Id_entity));
    CREATE TABLE IF NOT EXISTS users ( Id_user SERIAL NOT NULL, f_name VARCHAR(50), l_name VARCHAR(50), login VARCHAR(50), type VARCHAR(50), password VARCHAR(50), status VARCHAR(50), date_add DATE, date_update DATE, Id_entity INT NOT NULL, isp VARCHAR(50), PRIMARY KEY (Id_user), FOREIGN KEY (Id_entity) REFERENCES entity (Id_entity) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS list ( Id_list SERIAL NOT NULL, name VARCHAR(50), isp VARCHAR(50), status VARCHAR(50), date_add DATE, date_update DATE, Id_user INT NOT NULL, PRIMARY KEY (Id_list), FOREIGN KEY (Id_user) REFERENCES users (Id_user) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS seeds ( Id_seeds SERIAL NOT NULL, gmail VARCHAR(50) UNIQUE, password VARCHAR(50), isp VARCHAR(50), proxy VARCHAR(50), status VARCHAR(50), date_add DATE, date_update DATE, verification VARCHAR(50), Id_list INT NOT NULL, PRIMARY KEY (Id_seeds), FOREIGN KEY (Id_list) REFERENCES list (Id_list) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS process ( Id_process SERIAL NOT NULL, name VARCHAR(50), action VARCHAR(50), status VARCHAR(50), date_add DATE, date_update DATE, start_in TIMESTAMP, end_in TIMESTAMP, Id_list INT NOT NULL, Id_user INT NOT NULL, PRIMARY KEY (Id_process), FOREIGN KEY (Id_list) REFERENCES list (Id_list), FOREIGN KEY (Id_user) REFERENCES users (Id_user));
    CREATE TABLE IF NOT EXISTS results (Id_list INT, Id_seeds INT, Id_process INT, id_result SERIAL NOT NULL, feedback VARCHAR(50), start_in TIMESTAMP, end_in TIMESTAMP, PRIMARY KEY (id_result), FOREIGN KEY (Id_list) REFERENCES list (Id_list) ON DELETE CASCADE, FOREIGN KEY (Id_seeds) REFERENCES seeds (Id_seeds) ON DELETE CASCADE, FOREIGN KEY (Id_process) REFERENCES process (Id_process) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS processState ( id_state SERIAL NOT NULL, waiting VARCHAR(50), active VARCHAR(50), finished VARCHAR(50), failed VARCHAR(50), PRIMARY KEY (id_state), id_process INT NOT NULL, FOREIGN KEY (id_process) REFERENCES process (id_process) ON DELETE CASCADE)`
    pool.query(tables, (err, result) => {
        if (err) {
            response.status(500).send({ name: err.name, stack: err.stack, message: err.message, err: err })
        }
        response.status(200).send('Database --init --create --send "config" f--DONE => :)')
    })
}

module.exports = {
    createTables,
}