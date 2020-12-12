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

router.get("/register", function(req, res) {
  res.render("register", {
    curr_user: constants.curr_user,
    register_error: ""
  });
});

router.post("/register", async function(req, res) {

  const username = req.body.username;
  const fname = req.body.fname;
  const email = req.body.email;
  const sec_quest_id = req.body.sec_quest;
  const password = req.body.password;
  const security_answer = req.body.security_answer;

  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  var register_error = new Array();

  //check if first name is entered
  //if empty, send message to client
  if (fname == "" || username == "" || password == "" || email == "" || security_answer == "") {
    register_error.push("All fields must be filled.");
    console.log(register_error);
    res.render("register", {
      curr_user: constants.curr_user,
      register_error: register_error
    });
  } else {

    var viewUserList = lib.usernameSchema.validate(username, {
      list: true
    });

    if (viewUserList.length > 0) {
      var register_error = new Array();

      for (var i = 0; i < viewUserList.length; i++) {
        //if the error is min:
        if (viewUserList[i] == "min") {
          register_error.push("Your username should contain at least four characters.");
        } else if (viewUserList[i] == "spaces") {
          register_error.push("Your username should not contain spaces.");
        }
      }
      res.render("register", {
        curr_user: constants.curr_user,
        register_error: register_error
      });
    } else {
      var viewPasswordList = lib.passwordSchema.validate(password, {
        list: true
      });

      //if the viewList list is populated, then push each error message into an
      //array of custom validation messages and send to client
      if (viewPasswordList.length > 0) {
        var register_error = lib.validatePWMsg(viewPasswordList);
        res.render("register", {
          curr_user: constants.curr_user,
          register_error: register_error
        });

      } else {


      let stmt = "INSERT INTO USERS(fname, idSECQUEST, password, username, securityanswer, email) VALUES(?, ?, ?, ?, ?, ?);"

      let userinfo = [fname, sec_quest_id, encryptedPassword, username, security_answer, email];

      sql.query(stmt, userinfo, (err, result, fields) => {
        if (err) {
          register_error.push("This user already exists.");
          res.render("register", {
            curr_user: constants.curr_user,
            register_error: register_error
          });
        } else {
          console.log("Inserted into DB");
          constants.curr_user.username = username;
          constants.curr_user.fname = fname;
          res.redirect("/");

        }
      });
    }
  }
}

});

module.exports = router;
