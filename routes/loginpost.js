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
        let user_stmt = "SELECT password, fname FROM USERS WHERE username=?";
        //look for username & pw
        sql.query(user_stmt, username, (err, result, fields) => {
            if (err) {
              console.log(err);
            } else {
              //if the username exists, then see if passwords match
              if (result.length > 0) {
                fname = result[0].fname;
                //get matching pw

                bcrypt.compare(password, result[0].password, function(err, result) {
                    if (!err) {
                      //if the result is true, then log person in
                      if (result == true) {
                        //if the password is correct, store the username and first name in the
                        //appropriate global variables
                        constants.curr_user.username = username;
                        constants.curr_user.fname = fname;

                        var score_stmt = "SELECT * FROM SCORES WHERE USERNAME = ?";

                        sql.query(score_stmt, username, (err, result, fields) => {
                          if (!err) {
                            //if the score exists, save it
                            if (result.length > 0) {
                              total_score = result[0].total_score;

                              console.log("Password correct!");

                              constants.curr_user.total_score = total_score;
                              res.redirect("/");
                              // res.send({
                              //   redirect: true,
                              //   redirect_url: "/"
                              // });
                            } else {
                              total_score = 0;
                              constants.curr_user.total_score = 0;
                              res.redirect("/");
                              // res.send({
                              //   redirect: true,
                              //   redirect_url: "/"
                              // });
                            }
                          }

                        });

                      } else { //if result is not true, then send error message
                        var login_error = "Your password is incorrect. Please try again.";
                        res.render("login", {
                          curr_user: constants.curr_user,
                          login_error: login_error
                        });

                      }
                    }
                  });


                }  else { //otherwise tell me the username doesn't exist
                  var login_error = "This username does not exist";
                  res.render("loginn", {
                    curr_user: constants.curr_user,
                    login_error: login_error
                  });
                }

              }
            });
        }
      });



    module.exports = router;
