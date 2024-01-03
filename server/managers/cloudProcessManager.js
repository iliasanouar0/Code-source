const pg = require("pg");
var IdGenerator = require("auth0-id-generator");
const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);