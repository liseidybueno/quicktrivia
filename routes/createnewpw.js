//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mysql = require("mysql");
let config = require("./../config.js");
const lib = require('./../index.js');
let connection = mysql.createConnection(config);
const constants = require("./../constants.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/createnew", function(req, res) {
  res.render("createnewpw", {
    curr_user: constants.curr_user
  });
});

router.post("/createnew", function(req, res) {
  //get the passwords
  const username = req.body.username;
  const new_pw = req.body.newpw;
  const confirm_new_pw = req.body.confirmnewpw;

  var error_msg = "";
  var custom_msgs = new Array();

  if (username == "") {
    error_msg = "Enter your username.";
    res.send({
      error_msg: error_msg
    });
  } else {
    //if the first field is empty
    if (new_pw == "") {
      error_msg = "Enter a new password.";
      res.send({
        error_msg: error_msg
      });
    } else {
      //if the second field is empty
      if (confirm_new_pw == "") {
        error_msg = "Confirm new password.";
        res.send({
          error_msg: error_msg
        });
      } else {
        //if both fields are filled
        //compare passwords against each other and make sure they are the same
        if (new_pw != confirm_new_pw) {
          error_msg = "Passwords do not match.";
          res.send({
            error_msg: error_msg
          });
        } else {
          //if the passswords do match, check for validation
          var viewList = lib.passwordSchema.validate(confirm_new_pw, {
            list: true
          });

          //if the viewList list is populated, then push each error message into an
          //array of custom validation messages and send to client
          if (viewList.length > 0) {
            custom_msgs = lib.validatePWMsg(viewList);

            res.send({
              message: custom_msgs
            });

          } else {
            error_msg = "";
            //if there are no errors, then update password in database with hash
            bcrypt.hash(confirm_new_pw, saltRounds, function(err, hash) {
              var update_password = "UPDATE USERS SET password = ? WHERE username = ?";

              var update_pw_info = [hash, username];
              connection.query(update_password, update_pw_info, (err, result, fields) => {});

              //get the username, first name and score of the user and update the global variables
              var get_user_info = "SELECT * FROM USERS WHERE username = ?";

              connection.query(get_user_info, username, (err, result, fields) => {
                constants.curr_user.fname = result[0].fname;
                constants.curr_user.username = result[0].username;

                var correct = result[0].correct;
                var totalquestions = result[0].totalquestions;

                //get the score as percentage and round to the nearest whole number
                var total_score = Math.round((correct / totalquestions) * 100);

                constants.curr_user.total_score = total_score;

              });

              res.send({
                redirect: true,
                redirect_url: "/"
              });

            });
          }
        }
      }
    }
  }

});

module.exports = router;
