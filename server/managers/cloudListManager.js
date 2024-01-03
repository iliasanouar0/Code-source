const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const createList = (request, response) => {
  console.log(config);
  let obj = request.body;
  let add = new Date()
  let update = new Date()
  pool.query(
    "INSERT INTO cloudlist ( name, isp, status,  date_update, date_add, id_user)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_list",
    [
      obj.nom,
      obj.isp,
      obj.status,
      update,
      add,
      obj.id_user,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      response
        .status(200)
        .send(`cloudlist added with ID: ${results.rows[0].id_list}`);
    }
  );
};

const getLists = (request, response) => {
  pool.query(
    "SELECT cloudlist.*, COUNT(id_seeds) AS seeds_count, users.login, entity.nom FROM cloudlist LEFT JOIN seeds ON seeds.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity GROUP BY 1,users.id_user,users.id_entity,entity.id_entity ORDER BY cloudlist.date_add DESC",
    (error, results) => {
      if (error) {
        response.status(500).json(error.message);
      }
      response.status(200).json(results.rows);
    }
  );
};

const getListsSup = (req, res) => {
  pool.query(
    "SELECT cloudlist.*, COUNT(id_seeds) AS seeds_count, users.login,users.type, entity.nom FROM cloudlist LEFT JOIN seeds ON seeds.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity WHERE users.type!='IT' GROUP BY 1,users.id_user,users.id_entity,entity.id_entity ORDER BY cloudlist.date_add DESC",
    (error, results) => {
      if (error) {
        res.status(500).json(error.message);
      }
      res.status(200).json(results.rows);
    }
  );
}

const getUserLists = (request, response) => {
  let id = (request.params.id)
  let sql = "SELECT cloudlist.*, COUNT(id_seeds) AS seeds_count, users.login, entity.nom FROM cloudlist LEFT JOIN seeds ON seeds.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity WHERE cloudlist.id_user=($1) GROUP BY 1,users.id_user,users.id_entity,entity.id_entity ORDER BY cloudlist.date_add DESC"
  pool.query(sql, [id], (error, results) => {
    if (error) {
      response.status(500).json(error.message);
    }
    response.status(200).json(results.rows);
  }
  );
};

const deleteList = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM cloudlist WHERE id_list = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`cloudlist deleted with ID: ${id}`);
  });
};

const updateName = (request, response) => {
  const id = parseInt(request.params.id);
  const name = request.query.name;
  pool.query(
    "UPDATE cloudlist SET name=($2), date_update=(now()) where id_list= ($1)",
    [id, name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`cloudlist updated with ID: ${id}`);
    }
  );
};

const getIspList = (request, response) => {
  let id = (request.params.id)
  let sql = 'SELECT isp FROM cloudlist WHERE id_list=($1)'
  pool.query(sql, [id], (err, res) => {
    if (err) {
      response.status(500).send(err.message)
    }
    response.status(200).send(res.rows[0])
  })
}

module.exports = {
  createList,
  getLists,
  deleteList,
  updateName,
  getUserLists,
  getIspList,
  getListsSup
};
