//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const lib = require('./index.js');
const constants = require("./constants.js");
const home = require('./routes/home');
const quizquestions = require('./routes/quizquestions');
const quizresults = require('./routes/quizresults');
const score = require('./routes/score');
const register = require('./routes/register');
const login = require('./routes/login');
const resetpw = require('./routes/resetpw');
const createnewpw = require('./routes/createnewpw');
const emailwpw = require('./routes/emailpw');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.json());

app.use('/', home);

app.use('/', quizquestions);

app.use('/', quizresults);

app.use('/', score);

app.use('/', register);

app.use('/', login);

app.use('/', resetpw);

app.use('/', createnewpw);

app.use('/', emailwpw);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

console.log("Port: " + port);

app.listen(port, function() {
  console.log("Server started successfully.");
});
