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
      obj[i].verification,
      obj[i].id_list,
      obj[i].id_project
    ]);
  }
  const sql = format(
    "INSERT INTO cloudseed (id_seed, gmail, password, isp,  proxy, status, verification, Id_list, id_project) values %L",
    query
  );
  var qr = { text: sql, values: [] };

  pool.query(qr, (error, results) => {
    if (error) {
      throw error
      // response.status(200).send(error);
    }
    response.status(200).send(`records added to list`);
  });
};

const getSeedsById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT id_seed,gmail,password,proxy,isp,verification,id_list,refresh_token FROM cloudseed WHERE Id_list=$1",
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
  console.log(ides);
  const sql = "DELETE FROM cloudseed WHERE id_seed=$1";
  const params = [];
  for (let i = 0; i < ides.length; i++) {
    params.push([ides[i]])
  }
  params.forEach(param => {
    pool.query(sql, param, (err, result) => {
      if (err) { console.log(err); response.status(409).send(err) } else { console.log(`${result} records deleted`) }
    });
  });
  response.status(200).send('cloudseed deleted');
}

const deleteSeed = (request, response) => {
  const id = parseInt(request.params.id);
  const sql = "DELETE FROM cloudseed WHERE id_seed=$1";
  const params = [id];
  pool.query(sql, params, (err, result) => {
    if (err) { response.status(409).send(err) } else { console.log(`${result} records deleted`) }
  });
}

const updateSeed = (request, response) => {
  let obj = request.body;
  const sql =
    "UPDATE cloudseed SET password=($2), proxy=($3),verification=($4)  WHERE id_seed=$1";
  const params = [obj.id_seed, obj.password, obj.proxy, obj.verification];
  pool.query(sql, params, (error, results) => {
    if (error) {
      console.log(error);
      response.status(500).send(error);
    }
    response.status(200).send(`seed updated with ID : ${obj.id_seed}`);
  });
};

const updateSeeds = (request, response) => {
  let objects = (request.body)
  let query = []
  for (let i = 0; i < objects.length; i++) {
    let qr = "UPDATE cloudseed SET "
    let count = 0
    let data = []
    for (let val in objects[i]) {
      if (objects[i][val] != 'none' && objects[i][val] != '' && objects[i][val] != ' ') {
        if (val == 'gmail') {
          count++
          data.push(objects[i][val])
        } else {
          count++
          qr += `${val}=($${count}), `
          data.push(objects[i][val])
        }
      }
    }
    qr += ` WHERE gmail=($1)`
    query.push({ query: qr, data: data })
  }
  console.log(query);
  query.forEach((data) => {
    console.log(data.query);
    pool.query(data.query, data.data, (error, result) => {
      if (error) {
        response.status(409).send(error);
      }
    });
  });
  // response.status(200).send(`cloudseed updated successfully`);
}

const saveRefreshToken = async (data) => {
  const Update = "UPDATE cloudseed SET refresh_token=($1) WHERE id_seed=($2) AND id_list=($3)";
  const client = await pool.connect()
  const cloudlist = await client.query(Update, [data.refresh_token, data.id_seed, data.id_list]);
  client.release()
  return true
}

const searchSeeds = (request, response) => {
  const id = (request.params.id)
  const email = (request.query.gmail)
  let sql = `SELECT id_seed,gmail,password,proxy,isp,verification,id_list,refresh_token FROM cloudseed WHERE Id_list=$1 AND gmail  like $2`
  pool.query(sql, [id, `%${email}%`], (err, result) => {
    if (err) {
      response.status(409).send(err)
    }
    response.status(200).send(result.rows)
  })
}

/**
 * *Proxy management under cloudseed API => cloudseed/proxy/
 */

const checkProxy = (request, response) => {
  let obj = request.body;
  let query = [];
  for (let i = 0; i < obj.length; i++) {
    query.push([obj[i].id_list, obj[i].old]);
  }
  const SELECT = "SELECT id_seed FROM cloudseed WHERE Id_list=$1 AND proxy=($2)";
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
    "SELECT proxy,id_seed FROM cloudseed WHERE Id_list=$1 AND proxy=($2)",
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
  const Update = "UPDATE cloudseed SET proxy=($1) WHERE proxy=($2) AND id_list=($3)";
  query.forEach((data) => {
    pool.query(Update, data, (error, result) => {
      if (error) {
        response.status(409).send(error);
      }
      response.status(200).send(`cloudseed updated successfully`);
    });
  });
};

/**
 * * status management under cloudseed API => cloudseed/proxy/
 */

const runningState = (data) => {
  let query = []
  for (let i = 0; i < data.length; i++) {
    query.push(["running", data[i]])
  }
  const sql = 'UPDATE cloudseed SET status=($1) WHERE id_seed=($2)'
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
  const sql = `UPDATE cloudseed SET status=($1) WHERE id_seed=$2 AND status LIKE '%idel%' OR status LIKE '%stopped%'`
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
  const sql = `UPDATE cloudseed SET status=($1) WHERE id_seed=($2) AND status LIKE '%idel%' OR status LIKE '%waiting%'`
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
  const sql = `UPDATE cloudseed SET status=($1) WHERE id_seed=($2)`
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
  //~ Seeds  => /* cloudseed management functions */
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
  saveRefreshToken
  // runningState,
  // waitingState,
  // stoppedState,
  // successState
  // updateState
};
