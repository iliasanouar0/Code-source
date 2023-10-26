const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const { response, request } = require("express");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const createList = (request, response) => {
  let obj = request.body;
  var generator = new IdGenerator({
    len: 4,
    alphabet: "123" /*prefix: id_entity, separator: ' '*/,
  });
  let g = generator.get();
  pool.query(
    "INSERT INTO list (id_list, name, isp, status,  date_update, date_add, id_user)  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_list",
    [
      g,
      obj.nom,
      obj.isp,
      obj.status,
      obj.date_update,
      obj.date_add,
      obj.id_user,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      response
        .status(200)
        .send(`list added with ID: ${results.rows[0].id_list}`);
    }
  );
};

const getLists = (request, response) => {
  pool.query(
    "SELECT list.*, COUNT(id_seeds) AS seeds_count, users.login, entity.nom FROM list LEFT JOIN seeds ON seeds.id_list = list.id_list JOIN users ON list.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity GROUP BY 1,users.id_user,users.id_entity,entity.id_entity ORDER BY list.date_add DESC",
    (error, results) => {
      if (error) {
        response.status(500).json(error.message);
      }
      response.status(200).json(results.rows);
    }
  );
};

const getListByIdOrCount = (request, response) => {
  const id = request.params.id;
  const isCount = request.query.isCount;
  if (isCount) {
    pool.query(
      "SELECT COUNT(*) FROM seeds WHERE id_list=$1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  } else {
    pool.query(
      "SELECT * FROM list WHERE id_list=$1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  }
};

const deleteList = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM list WHERE id_list = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`list deleted with ID: ${id}`);
  });
};

const updateName = (request, response) => {
  const id = parseInt(request.params.id);
  const name = request.query.name;
  pool.query(
    "UPDATE list SET name=($2), date_update=(now()) where id_list= ($1)",
    [id, name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`list updated with ID: ${id}`);
    }
  );
  // response.status(200).send(request)
};

module.exports = {
  createList,
  getLists,
  deleteList,
  getListByIdOrCount,
  updateName,
};
