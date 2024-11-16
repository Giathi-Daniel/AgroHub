//importing dependencies
const mysql = require("mysql2");
require("dotenv").config();
// const knex = require('knex')
// const connection = require('../knexfile')

// const database = knex(connection.development)

//create pool connection object
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//export connection
module.exports = db.promise();