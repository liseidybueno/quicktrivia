//jshint esversion:6
const constants = require("./../constants.js");
const express = require("express");
const ejs = require("ejs");
var mysql = require("mysql");
let config = require("./../config.js");
const lib = require('./../index.js');
let connection = mysql.createConnection(config);
const router = express.Router();

  //landing page
router.get("/", function(req, res) {

    constants.round_questions.length = 0;

    var score = 0;

    console.log(constants.curr_user.username);
    console.log(constants.curr_user.fname);

    var questionNumber = 0;

    var scoreboard_query = "SELECT * FROM SCORES";

    connection.query(scoreboard_query, (error, results, fields) => {
      var score_array = lib.createScoreboard(results);

      //sort array by score
      score_array.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      //if logged in, look for the username in the scoreboard
      if (constants.curr_user.username != "") {
        for (var i = 0; i < score_array.length; i++) {
          if (score_array[i].username == constants.curr_user.username) {
            constants.curr_user.rank = i + 1;
            break;
          }
        }
      }

      //render quiz home page with question number at 0
      res.render("quiz", {
        questionNumber: questionNumber,
        score_array: score_array,
        curr_user: constants.curr_user,
        round_questions: constants.round_questions,
        score: score
      });

    });

  });


  //main page post to keep current username
router.post("/", function(req, res) {

    res.redirect("/");

  });

module.exports = router;
