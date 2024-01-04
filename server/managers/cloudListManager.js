const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);


// id_list
// name
// isp
// status
// add_date
// update_dat
// id_user
// id_project

const createList = (request, response) => {
  let obj = request.body;
  pool.query(
    "INSERT INTO cloudlist ( name, isp, status, id_user, id_project)  VALUES ($1, $2, $3, $4, $5) RETURNING id_list",
    [
      obj.nom,
      obj.isp,
      obj.status,
      obj.id_user,
      obj.project
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
    "SELECT cloudlist.*, COUNT(id_seed) AS seeds_count, cloudproject.name AS project_name ,users.login, entity.nom FROM cloudlist LEFT JOIN cloudseed ON cloudseed.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity JOIN cloudproject ON cloudlist.id_project=cloudproject.id_project GROUP BY 1,users.id_user,users.id_entity,entity.id_entity,cloudlist.name,cloudlist.isp,cloudlist.status,cloudlist.add_date,cloudlist.update_date,cloudlist.id_user,cloudlist.id_project,cloudlist.id_list,cloudproject.name ORDER BY cloudlist.add_date DESC",
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
    "SELECT cloudlist.*, COUNT(id_seed) AS seeds_count, users.login,users.type, cloudproject.name AS project_name ,entity.nom FROM cloudlist LEFT JOIN cloudseed ON cloudseed.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity JOIN cloudproject ON cloudlist.id_project=cloudproject.id_project WHERE users.type!='IT' GROUP BY 1,users.id_user,users.id_entity,entity.id_entity,cloudlist.name,cloudlist.isp,cloudlist.status,cloudlist.add_date,cloudlist.update_date,cloudlist.id_user,cloudlist.id_project,cloudlist.id_list,cloudproject.name  ORDER BY cloudlist.add_date DESC",
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
  let sql = "SELECT cloudlist.*, COUNT(id_seed) AS seeds_count, cloudproject.name AS project_name,users.login, entity.nom FROM cloudlist LEFT JOIN cloudseed ON cloudseed.id_list = cloudlist.id_list JOIN users ON cloudlist.id_user=users.id_user JOIN entity ON users.id_entity=entity.id_entity JOIN cloudproject ON cloudlist.id_project=cloudproject.id_project WHERE cloudlist.id_user=($1) GROUP BY 1,users.id_user,users.id_entity,entity.id_entity,cloudlist.name,cloudlist.isp,cloudlist.status,cloudlist.add_date,cloudlist.update_date,cloudlist.id_user,cloudlist.id_project,cloudlist.id_list,cloudproject.name  ORDER BY cloudlist.add_date DESC"
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
    "UPDATE cloudlist SET name=($2), update_date=(now()) where id_list= ($1)",
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
  let sql = 'SELECT isp,id_project FROM cloudlist WHERE id_list=($1)'
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
