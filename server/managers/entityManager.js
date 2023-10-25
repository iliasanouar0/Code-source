const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const { response } = require("express");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

const createEntity = async (request, response) => {

  let obj = (request.body);
  var generator = new IdGenerator({
    len: 4,
    alphabet: "123" /*prefix: id_entity, separator: ' '*/,
  });
  let g = generator.get();
  pool.query(
    "INSERT INTO entity( nom, status, date_update, date_add)  VALUES ($1, $2, $3, $4) RETURNING id_entity",
    [obj.nom, obj.status, obj.date_update, obj.date_add],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`entity added with ID: ${results.rows[0].id_entity}`);
    }
  );
};

const getEntityById = (request, response) => {
  const id_entity = request.params.id;
  pool.query(
    "SELECT * FROM entity WHERE id_entity = $1",
    [id_entity],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results.rows);
    }
  );
};

const getEntities = (request, response) => {
  pool.query(
    "SELECT * FROM entity ORDER BY id_entity ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const deleteEntity = (request, response) => {
  const id = parseInt(request.params.id);
  // response.status(200).send(id)
  pool.query(
    "DELETE FROM entity WHERE id_entity = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`entity deleted with ID: ${id}`);
    }
  );
};

const updateEntity = (request, response) => {
  const id = parseInt(request.params.id);
  const { nom, status, date_update } = request.body;

  pool.query(
    "UPDATE entity SET id_entity=$1, nom=$2, status=$3, date_update=$4 WHERE id_entity = $1",
    [id, nom, status, date_update],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Entity modified with ID: ${id}`);
    }
  );
};

module.exports = {
  createEntity,
  getEntities,
  deleteEntity,
  getEntityById,
  updateEntity,
};
