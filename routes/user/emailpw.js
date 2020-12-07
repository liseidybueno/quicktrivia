//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mysql = require("mysql");
const nodemailer = require('nodemailer');
let config = require("./../../db.js");
const lib = require('./../../index.js');
let connection = mysql.createConnection(config);
const constants = require("./../../constants.js");
const router = express.Router();

router.post("/emailpw", function(req, res) {

  const username = req.body.username;

  //get the first name from the DB
  var email_query = "SELECT * FROM USERS WHERE username = ?";

  var fname = "";
  var email = "";

  connection.query(email_query, username, (err, result, fields) => {
    if (!err) {
      email = result[0].email,
        fname = result[0].fname
    }

    console.log(email);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'liseidybueno@gmail.com',
        pass: 'abc123xyz321'
      }
    });

    var mailOptions = {
      from: 'liseidybueno@gmail.com',
      to: email,
      subject: 'Quick Trivia Reset Password',
      html: '<p>Hi, ' + fname + '!</p><p>Your username is: ' + username + '</p><p>Click here to reset password: <a href="http://localhost:3005/createnew">Create</a>'
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent");
        res.send({
          error_msg: "Your email has been sent!"
        });
      }
    });

  });

});

module.exports = router;
