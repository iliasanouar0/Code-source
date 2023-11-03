const pg = require("pg");

const data = require('../db');

let config = data.data

const pool = new pg.Pool(config);