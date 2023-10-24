const pg = require("pg");
const IdGenerator = require("auth0-id-generator");
const format = require("pg-format");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const createSeed = (request, response) => {
  let obj = request.body;
  let len = getRndInteger(100000000, 99999999999999);
  var generator = new IdGenerator({
    len: 4,
    alphabet: `${len}` /*prefix: id_entity, separator: ' '*/,
  });
  let g = generator.get();
  let query = [];
  for (let i = 0; i < obj.length; i++) {
    query.push([
      g + i,
      obj[i].email,
      obj[i].password,
      obj[i].isp,
      obj[i].proxy,
      obj[i].status,
      obj[i].date_add,
      obj[i].date_update,
      obj[i].verification,
      obj[i].id_list,
    ]);
  }
  const sql = format(
    "INSERT INTO seeds (Id_seeds, gmail, password, isp,  proxy, status, date_add, date_update, verification, Id_list) values %L",
    query
  );
  var qr = { text: sql, values: [] };

  pool.query(qr, (error, results) => {
    if (error) {
      response.status(500).send(error);
    }
    response.status(200).send(`records added to list`);
  });
};

const getSeedsById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT Id_seeds,gmail,password,proxy,isp,verification,id_list FROM seeds WHERE Id_list=$1",
    [id],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      response.status(200).send(results.rows);
    }
  );
};

const deleteSeeds = (request, response) => {
  const ides = (request.body);
  const sql = "DELETE FROM seeds WHERE Id_seeds=$1";
  const params = [];
  for (let i = 0; i < ides.length; i++) {
    params.push([ides[i]])
  }
  params.forEach(param => {
    pool.query(sql, param, (err, result) => {
      if (err) { response.status(409).send(err) } else { console.log(`${result} records deleted`) }
    });
  });
  response.status(200).send('seeds deleted');
}

const deleteSeed = (request, response) => {
  const id = parseInt(request.params.id);
  const sql = "DELETE FROM seeds WHERE Id_seeds=$1";
  const params = [id];
  pool.query(sql, params, (err, result) => {
    if (err) { response.status(409).send(err) } else { console.log(`${result} records deleted`) }
  });
}

const updateSeed = (request, response) => {
  let obj = request.body;
  const sql =
    "UPDATE seeds SET password=($2), proxy=($3),verification=($4), date_update=(now())  WHERE id_seeds=$1";
  const params = [obj.id_seed, obj.password, obj.proxy, obj.verification];
  pool.query(sql, params, (error, results) => {
    if (error) {
      response.status(500).send(error);
    }
    response.status(200).send(`seed updated with ID : ${obj.id_seed}`);
  });
};

const updateSeeds = (request, response) => {
  let objects = (request.body)
  let query = []
  for (let i = 0; i < objects.length; i++) {
    let qr = "UPDATE seeds SET "
    let count = 0
    let data = []
    for (let val in objects[i]) {
      if (objects[i][val] != 'none'/* && '' && ' '*/) {
        count++
        qr += `${val}=($${count}), `
        data.push(objects[i][val])
      }
    }
    qr += `date_update=(now()) WHERE gmail=($1)`
    query.push({ query: qr, data: data })
  }
  query.forEach((data) => {
    pool.query(data.query, data.data, (error, result) => {
      if (error) {
        response.status(409).json(error);
      }
    });
  });
  response.status(200).send(`seeds updated successfully`);
}

const searchSeeds = (request, response) => {
  const id = (request.params.id)
  const email = (request.query.gmail)
  let sql = `SELECT Id_seeds,gmail,password,proxy,isp,verification,id_list FROM seeds WHERE Id_list=$1 AND gmail  like $2`
  pool.query(sql, [id, `%${email}%`], (err, result) => {
    if (err) {
      response.status(409).send(err)
    }
    response.status(200).send(result.rows)
  })
}

/**
 * *Proxy management under seeds API => seeds/proxy/
 */

const checkProxy = (request, response) => {
  let obj = request.body;
  let query = [];
  for (let i = 0; i < obj.length; i++) {
    query.push([obj[i].id_list, obj[i].old]);
  }
  const SELECT = "SELECT id_seeds FROM seeds WHERE Id_list=$1 AND proxy=($2)";
  for (let i = 0; i < query.length; i++) {
    pool.query(SELECT, query[i], (error, result) => {
      if (error) {
        response.status(409).json(error);
      }
      if (result.rows.length == 0) {
        response.status(200).send({ data: result.rows, query: query[i] });
        return;
      }
    });
  }
};

const getProxy = (request, response) => {
  const id = parseInt(request.params.id);
  const proxy = request.query.proxy;
  pool.query(
    "SELECT proxy,id_seeds FROM seeds WHERE Id_list=$1 AND proxy=($2)",
    [id, proxy],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      response.status(200).send(results.rows);
    }
  );
};

const updateProxy = (request, response) => {
  let obj = request.body;
  let query = [];
  for (let i = 0; i < obj.length; i++) {
    query.push([obj[i].proxy, obj[i].old, obj[i].id_list]);
  }
  const Update = "UPDATE seeds SET proxy=($1), date_update=(now()) WHERE proxy=($2) AND id_list=($3)";
  query.forEach((data) => {
    pool.query(Update, data, (error, result) => {
      if (error) {
        response.status(409).json(error);
      }
      response.status(200).send(`seeds updated successfully`);
    });
  });
};

/**
 * * status management under seeds API => seeds/proxy/
 */

const runningState = (data) => {
  let query = []
  for (let i = 0; i < data.length; i++) {
    query.push(["running", data[i]])
  }
  const sql = 'UPDATE seeds SET status=($1) WHERE id_seeds=($2)'
  query.forEach(data => {
    pool.query(sql, data, (error, result) => {
      if (error) {
        return error
      }
    })
  })
}

const waitingState = (data) => {
  let query = []
  for (let i = 0; i < data.length; i++) {
    query.push(["waiting", data[i]])
  }
  const sql = `UPDATE seeds SET status=($1) WHERE id_seeds=$2 AND status LIKE '%idel%' OR status LIKE '%stopped%'`
  query.forEach(data => {
    pool.query(sql, data, (error, result) => {
      if (error) {
        return error
      }
    })
  })
  return true
}

const stoppedState = (data) => {
  let query = []
  for (let i = 0; i < data.length; i++) {
    query.push(["stopped", data[i]])
  }
  const sql = `UPDATE seeds SET status=($1) WHERE id_seeds=($2) AND status LIKE '%idel%' OR status LIKE '%waiting%'`
  query.forEach(data => {
    pool.query(sql, data, (error, result) => {
      if (error) {
        return error
      }
    })
  })
  return true
}


const successState = (data) => {
  let query = []
  for (let i = 0; i < data.length; i++) {
    query.push(["success", data[i]])
  }
  const sql = `UPDATE seeds SET status=($1) WHERE id_seeds=($2)`
  query.forEach(data => {
    pool.query(sql, data, (error, result) => {
      if (error) {
        return error
      }
    })
  })
  return true
}



module.exports = {
  //~ Seeds  => /* seeds management functions */
  createSeed,
  getSeedsById,
  deleteSeeds,
  deleteSeed,
  updateSeed,
  updateSeeds,
  searchSeeds,
  //~ Proxy  => /* proxy management functions */
  checkProxy,
  updateProxy,
  getProxy,
  //~ Status => /* status management functions */
  // runningState,
  // waitingState,
  // stoppedState,
  // successState
  // updateState
};
