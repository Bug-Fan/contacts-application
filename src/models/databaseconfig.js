const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.user,
  password: process.env.password,
  port: process.env.PORT,
  database: "contactapp",
  host: "localhost",
});

module.exports = pool;
