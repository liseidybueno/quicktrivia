//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lib = require('./../index.js');
const sql = require("./../config.js");
const constants = require("./../constants.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/loginpost", function(req, res) {

  const username = req.body.username;
  const password = req.body.password;
  var fname = "";
  var total_score = "";

  let user_stmt = "SELECT * FROM USERS WHERE username=?";

  //look for username
  sql.query(user_stmt, username, (err, result, fields) => {
    if(err){
      console.log(err);
    }else if (!err) {
      console.log("Look for username");
      //if there is no error, check if the username exists
      //if it exists, then get the fname and make sure the password is correct
      if (result.length > 0) {
        fname = result[0].fname;

        bcrypt.compare(password, result[0].password, function(err, result) {
          if (result === true) {
            //if the password is correct, store the username and first name in the
            //appropriate global variables
            constants.curr_user.username = username;
            constants.curr_user.fname = fname;

            //then, look through the score table for the total score
            var score_stmt = "SELECT * FROM SCORES WHERE username = ?";


            sql.query(score_stmt, username, (err, result, fields) => {
              if (!err) {
                //if the score exists, save it
                if (result.length > 0) {
                  total_score = result[0].total_score;

                  console.log("Password correct!");

                  constants.curr_user.total_score = total_score;

                  res.send({
                    redirect: true,
                    redirect_url: "/"
                  });
                } else {
                  total_score = 0;
                  constants.curr_user.total_score = 0;

                  res.send({
                    redirect: true,
                    redirect_url: "/"
                  });
                }
              }

            });

          } else {
            constants.curr_user.username = "";
            constants.curr_user.fname = "";
            console.log("PW incorrect");
            const login_error = "Sorry, your password is incorrect. Please try again!";
            res.send({
              login_error: login_error
            });
          }
        }); //if it doesn't exist, then tell user their username is incorrect
      } else {
        constants.curr_user.username = "";
        constants.curr_user.fname = "";
        console.log("Username incorrect");
        const login_error = "Sorry, that username does not exist. Please try again!";
        res.send({
          login_error: login_error
        });

      }
    }

  });

});

router.get("/logout", function(req, res) {
  constants.curr_user = {
    username: "",
    fname: "",
    total_score: ""
  }
  res.redirect("/");
});

module.exports = router;
