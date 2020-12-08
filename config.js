// let config = {
//   host    : 'localhost',
//   user    : 'root',
//   password: 'AbC123XyZ321',
//   database: 'triviaquizdb'
// };
// module.exports = config;
var mysql = require("mysql");

let config = {
  host: "us-cdbr-east-02.cleardb.com",
  user: "b02f444a30ab24",
  password: "84e47103",
  database: "heroku_33b59430916aed3"
};

const connection = mysql.createPool(config);

connection.connect(error => {
  if(error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
