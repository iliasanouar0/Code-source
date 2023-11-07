const pg = require("pg");
const passwordHash = require('password-hash');
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const getUsers = (request, response) => {
  pool.query("SELECT *,entity.nom AS entity_name FROM users JOIN entity ON users.id_entity=entity.id_entity GROUP BY users.id_entity,entity.id_entity,users.id_user ORDER BY id_user ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserByLogin = (request, response) => {
  const id = request.params.id;
  const login = request.query.login;
  pool.query(
    "SELECT * FROM users WHERE id_user = $1 OR login = $2",
    [id, login],
    (error, results) => {
      if (error) {
        response.status(500).json({ name: error.name, stack: error.stack, message: error.message, err: error });
      }
      response.status(200).json(results.rows);
    }
  );
};

const checkPass = (request, response) => {
  const id = parseInt(request.params.id)
  const pass = (request.query.pass);
  pool.query(
    "SELECT password FROM users WHERE id_user = $1",
    [id],
    (error, results) => {
      if (error) {
        response.status(500).json({ name: error.name, stack: error.stack, message: error.message, err: error });
      }
      let check = results.rows[0].password
      response.status.send(passwordHash.verify(pass, check))
    }
  );
}

const createUser = (request, response) => {
  let obj = request.body;
  let add = new Date()
  let update = new Date()
  pool.query(
    "INSERT INTO users (f_name, l_name, login, type, password, status, date_add, date_update, id_entity, isp) VALUES ($1, $2, $3,$4,$5,$6,$7,$8, $9, $10) RETURNING id_user",
    [
      obj.f_name,
      obj.l_name,
      obj.login,
      obj.type,
      obj.password,
      obj.status,
      add,
      update,
      obj.id_entity,
      obj.isp,
    ],
    (error, results) => {
      if (error) {
        response.status(401).send({ name: error.name, stack: error.stack, message: error.message, err: error })
      }
      response
        .status(200)
        .send(`User added with ID: ${results.rows[0].id_user}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    f_name,
    l_name,
    type,
    status,
    date_update,
    id_entity,
    isp,
  } = request.body;

  pool.query(
    "UPDATE users SET f_name=$2, l_name=$3, type=$4, status=$5, date_update=$6, id_entity=$7, isp=$8 WHERE id_user = $1",
    [
      id,
      f_name,
      l_name,
      type,
      status,
      date_update,
      id_entity,
      isp,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM users WHERE id_user = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const updatePass = (request, response) => {
  const id = parseInt(request.params.id)
  const pass = (request.query.pass);
  let hash = passwordHash.generate(pass, { algorithm: 'md5' })
  let sql = 'UPDATE users SET password=($1) WHERE id_user = $2'
  let data = [hash, id]
  pool.query(sql, data, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
}

module.exports = {
  getUsers,
  getUserByLogin,
  createUser,
  updateUser,
  deleteUser,
  updatePass,
  checkPass
};
