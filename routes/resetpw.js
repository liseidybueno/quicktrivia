//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const sql = require("./../config.js");
const lib = require('./../index.js');
const constants = require("./../constants.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/resetpassword", function(req, res) {
  res.render("resetpassword", {
    curr_user: constants.curr_user
  });
});

router.post("/resetpassword", function(req, res) {
  //get the username entered
  const username = req.body.username;
  var error_msg = "";

  //look for the security question # associated with the username in the DB
  const username_query = "SELECT * FROM USERS WHERE username = ?";

  sql.query(username_query, username, (err, result, fields) => {
    if (!err) {
      //if the username exists, then get the security question number
      if (result.length > 0) {
        var security_question_num = result[0].idSECQUEST;

        //look for the security question in the security questions table
        const question_query = "SELECT * FROM SECQUEST WHERE idSECQUEST = ?";
        sql.query(question_query, security_question_num, (err, result, fields) => {
          if (!err) {
            //send the question
            var security_question = result[0].question;
            res.send({
              security_question: security_question
            })
          }
        });
      } else {
        //otherwise, send error message
        error_msg = "This username does not exist. Please try another or register for an account.";
        res.send({
          error_msg: error_msg
        })
      }
    }
  });
});

router.post("/reset-sec", function(req, res) {
  //get the security answer  and username
  const security_answer = req.body.sec_answer;
  const username = req.body.username;
  var error_msg = "";
  constants.curr_user.username = username;

  console.log(security_answer);
  console.log(username);
  //look for the username in the database and check to see if the security answer is the same
  var security_query = "SELECT * FROM USERS WHERE username = ?";

  sql.query(security_query, username, (err, result, fields) => {
    if (!err) {
      //get the security answer from the db
      var correct_answer = result[0].securityanswer;

      console.log(correct_answer);

      //if they are the same, then go to the create new password page
      if (security_answer == correct_answer) {
        error_msg = "";
        res.send({
          redirect: true,
          redirect_url: "/createnew"
        });
      } else {
        //if they aren't the same, send error message
        error_msg = "The security answer is incorrect. Please try again or send an email to reset your password.";
        res.send({
          error_msg: error_msg
        });
      }
    }
  });

});

module.exports = router;
