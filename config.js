require('dotenv').config();
var mysql = require("mysql");

var connection = mysql.createPool({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b02f444a30ab24",
  password: "84e47103",
  database: "heroku_33b59430916aed3"
});

module.exports = connection;
