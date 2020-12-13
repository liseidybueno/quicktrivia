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

router.get("/createnew", function(req, res) {
  res.render("createnewpw", {
    curr_user: constants.curr_user,
    error_msg: ""
  });
});

router.post("/createnew", async function(req, res) {
  //get the passwords
  const username = req.body.username;
  const new_pw = req.body.newpw;
  const confirm_new_pw = req.body.confirmpw;

  var error_msg = new Array();

  if (username == "" || new_pw == "" || confirm_new_pw == "") {
    error_msg.push("All fields must be filled.");
    res.render("createnewpw", {
      error_msg: error_msg,
      curr_user: constants.curr_user
    });
  } else {
    //if all fields are filled
    //compare passwords against each other and make sure they are the same
    if (new_pw != confirm_new_pw) {
      error_msg.push("Passwords do not match.");
      res.render("createnewpw", {
        error_msg: error_msg,
        curr_user: constants.curr_user
      });
    } else {
      //if the passswords do match, check for validation
      var viewList = lib.passwordSchema.validate(confirm_new_pw, {
        list: true
      });

      //if the viewList list is populated, then push each error message into an
      //array of custom validation messages and send to client
      if (viewList.length > 0) {
        error_msg = lib.validatePWMsg(viewList);

        res.render("createnewpw", {
          error_msg: error_msg,
          curr_user: constants.curr_user
        });

      } else {
        //if there are no errors, then update password in database with hash
        const encryptedPassword = await bcrypt.hash(confirm_new_pw, saltRounds);
        var update_password = "UPDATE USERS SET password = ? WHERE username = ?";

        var update_pw_info = [encryptedPassword, username];
        sql.query(update_password, update_pw_info, (err, result, fields) => {
          console.log(result.affectedRows);

          if (result.affectedRows == 0) {
            error_msg.push("This username does not exist.");
            res.render("createnewpw", {
              error_msg: error_msg,
              curr_user: constants.curr_user
            });
          } else {
            //get the username, first name and score of the user and update the global variables
            var get_user_info = "SELECT * FROM USERS WHERE username = ?";

            sql.query(get_user_info, username, (err, result, fields) => {
              constants.curr_user.fname = result[0].fname;
              constants.curr_user.username = result[0].username;

              var correct = result[0].correct;
              var totalquestions = result[0].totalquestions;

              //get the score as percentage and round to the nearest whole number
              var total_score = Math.round((correct / totalquestions) * 100);

              constants.curr_user.total_score = total_score;

              res.redirect("/");

            });
          }


        });
      }
    }
  }
});

module.exports = router;
