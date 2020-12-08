//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mysql = require("mysql");
let config = require("./../../config.js");
const lib = require('./../../index.js');
const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
});
const constants = require("./../../constants.js");
const home = require("./../home.js")
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;


router.get("/register", function(req, res) {
  res.render("register", {
    curr_user: constants.curr_user
  });
});

router.post("/register-get", function(req, res) {

  const username = req.body.username;
  const fname = req.body.fname;
  const email = req.body.email;
  const sec_quest_id = req.body.sec_quest;
  const password = req.body.password;
  const security_answer = req.body.sec_answer;

  //first, check if username exists
  let user_stmt = "SELECT * FROM USERS WHERE username = ?";

  var user_exists = "";

  var security_msg = "";

  //check if first name is entered
  //if empty, send message to client
  if (fname == "") {
    var fname_empty = "Please enter your name.";
    res.send({
      empty: fname_empty
    });
  } else {

    //check if the username is empty
    if (username == "") {
      var username_empty = "Please enter a username.";
      res.send({
        empty: username_empty
      });
    } else {

      //if first name is entered, search for username in database
      connection.query(user_stmt, username, (err, result, fields) => {
        if (!err) {
          //if the user name exists, send a message that it exists
          if (result.length > 0) {
            console.log("username exists");
            var user_exists = "This username already exists. Log in or choose a different username.";
            res.send({
              user_exists: user_exists
            });
          } else {
            //if the username does not exist, validate username
            console.log("username does not exist");
            //validate username
            var viewUserList = lib.usernameSchema.validate(username, {
              list: true
            });

            //if the username has validation errors, send message
            if (viewUserList.length > 0) {
              var user_custom_msg = new Array();

              for (var i = 0; i < viewUserList.length; i++) {
                //if the error is min:
                if (viewUserList[i] == "min") {
                  user_custom_msg.push("Your username should contain at least four characters.");
                } else if (viewUserList[i] == "spaces") {
                  user_custom_msg.push("Your username should not contain spaces.");
                }
              }

              res.send({
                message: user_custom_msg
              });
            } else {
              //otherwise, check if the email is empty
              if (email == "") {
                var email_empty = "Please enter a valid email address.";
                res.send({
                  empty: email_empty
                });
              } else {
                //if the email is not empty, check if it's already in the DB
                var email_stmt = "SELECT * FROM USERS WHERE email = ?";

                connection.query(email_stmt, email, (err, result, fields) => {
                  if (!err) {
                    //if the email exists, send a message that it exists
                    if (result.length > 0) {
                      var email_exists = "This email already exists. Please log in or use another email address.";
                      res.send({
                        user_exists: email_exists
                      });
                    } else { //if the email does not exist, check if PW is empty
                      if (password == "") {
                        var password_empty = "Please enter a valid password.";
                        res.send({
                          empty: password_empty
                        });
                      } else {
                        //if the password is not empty, validate password
                        var viewList = lib.passwordSchema.validate(password, {
                          list: true
                        });

                        //if the viewList list is populated, then push each error message into an
                        //array of custom validation messages and send to client
                        if (viewList.length > 0) {
                          var custom_msgs = lib.validatePWMsg(viewList);

                          res.send({
                            message: custom_msgs
                          });
                        } else {
                          //if there are no errors in the password
                          //check if security question is empty
                          if (security_answer == "") {
                            security_msg = "Please enter an answer to the security question.";
                            res.send({
                              security_msg: security_msg
                            });

                            //ALL fields are approved
                            //insert user's details into the database then go to the home page
                          } else {
                            //global username and first name are the current username and first name

                            constants.curr_user.username = username;
                            constants.curr_user.fname = fname;

                            //insert into DB

                            //use bcrypt to hash the password
                            bcrypt.hash(password, saltRounds, function(err, hash) {

                              let stmt = "INSERT INTO USERS(fname, idSECQUEST, password, username, securityanswer, email) VALUES(?, ?, ?, ?, ?, ?);"

                              let userinfo = [fname, sec_quest_id, hash, username, security_answer, email];

                              connection.query(stmt, userinfo, (err, result, fields) => {
                                if (err) {
                                  return console.error(err.message);
                                } else {
                                  console.log("Inserted into DB");
                                  res.send({
                                    redirect: true,
                                    redirect_url: "/"
                                  });
                                }
                              });
                            });
                          }

                        }
                      }

                    }
                  }

                });
              }

            }
          }
        }
      });
    }
  }
});

module.exports = router;
