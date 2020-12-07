//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const lib = require('./index.js');
const constants = require("./constants.js");
const home = require('./routes/home');
const quizquestions = require('./routes/quiz/quizquestions');
const quizresults = require('./routes/quiz/quizresults');
const score = require('./routes/quiz/score');
const register = require('./routes/user/register');
const login = require('./routes/user/login');
const resetpw = require('./routes/user/resetpw');
const createnewpw = require('./routes/user/createnewpw');
const emailwpw = require('./routes/user/emailpw');

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

app.listen(port, function() {
  console.log("Server started successfully.");
});
