//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const lib = require('./../index.js');
const sql = require("./../config.js");
const constants = require("./../constants.js");
const router = express.Router();

router.post("/emailpw", function(req, res) {

  const username = req.body.username;

  //get the first name from the DB
  var email_query = "SELECT * FROM USERS WHERE username = ?";

  var fname = "";
  var email = "";

  sql.query(email_query, username, (err, result, fields) => {
    if (!err) {
      email = result[0].email,
        fname = result[0].fname
    }

    console.log(email);

    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW
      }
    });

    var mailOptions = {
      from: 'liseidybueno@gmail.com',
      to: email,
      subject: 'Quick Trivia Reset Password',
      html: '<p>Hi, ' + fname + '!</p><p>Your username is: ' + username + '</p><p>Click here to reset password: <a href="hhttps://quicktrivia.herokuapp.com/createnew">Create New</a>'
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent");
        var error_msg = new Array();
        error_msg.push("Your email has been sent!");
        res.render("resetpassword", {
          username: username,
          curr_user: constants.curr_user,
          security_question: "",
          error_msg: error_msg
        });
      }
    });

  });

});

module.exports = router;
