const config = require('./config');
const { db: { user, database, host, port, password } } = config;
let data = {
    user: user,
    host: host,
    database: database,
    password: password,
    port: parseInt(port),
    max: -1
}
// const pool = new pg.Pool(data);

module.exports = {
    data,
}


