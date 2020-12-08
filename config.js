require('dotenv').config();
var mysql = require("mysql");

var connection = mysql.createPool({
  host: process.env.REMOTE_HOST,
  user: process.env.REMOTE_USER,
  password: process.env.REMOTE_PW,
  database: process.env.REMOTE_DB
});

module.exports = connection;
