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

      if (username == "") {
        //username is blank
        var login_error = "Username not found. Please enter a valid username or register.";
        res.render("login", {
          curr_user: constants.curr_user,
          login_error: login_error
        });
      } else { //else if it is not blank
        let user_stmt = "SELECT * FROM USERS WHERE username = ?";
        //look for username & pw
        sql.query(user_stmt, username, (err, result, fields) => {
          if(err){
            var login_error = "This username or password does not exist. Please try again or register.";
            res.render("login", {
              curr_user: constants.curr_user,
              login_error: login_error
            });
          } else {
            if(result.length > 0){
              const comparison = bcrypt.compare(password, result[0].password);
              if(comparison){
                constants.curr_user.username = username;
                constants.curr_user.fname = result[0].fname;

                const total_questions = Number(result[0].totalquestions);
                const correct = Number(result[0].correct);

                console.log(total_questions);
                console.log(correct);

                const total_score = Math.round((correct / total_questions) * 100);

                console.log(total_score);

                constants.curr_user.total_score = total_score;

                const url = "/";

                if(process.env.PORT != null || process.env.PORT != ""){
                  const url = "https://quicktrivia.herokuapp.com/";
                }

                res.redirect(url);
              } else {
                var login_error = "Username and password do not match.";
                res.render("login", {
                  curr_user: constants.curr_user,
                  login_error: login_error
                });
              }
            } else {
              var login_error = "Username does not exist.";
              res.render("login", {
                curr_user: constants.curr_user,
                login_error: login_error
              });
            }
          }
        });


      }

      });



    module.exports = router;
