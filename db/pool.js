const {Pool} = require('pg')

module.exports = new Pool({
  host: "localhost", 
  user: "postgres",
  database: "users_message",
  password: "freefire",
  port: 5432 
});