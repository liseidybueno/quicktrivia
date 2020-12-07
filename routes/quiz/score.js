const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mysql = require("mysql");
let config = require("./../../db.js");
const lib = require('./../../index.js');
let connection = mysql.createConnection(config);
const constants = require("./../../constants.js");
const router = express.Router();

//quiz score page
router.post("/quizscore", function(req, res) {

  var score = req.body.score;

  console.log(score);

  //if a user is logged in:
  if (constants.curr_user.username != "") {
    //insert the score into the database
    //first get the current score from the DB
    var get_score = "SELECT * FROM USERS WHERE username = ?";

    //find the score in the database
    connection.query(get_score, constants.curr_user.username, (error, results, fields) => {
      if (!error) {

        var total_questions = "";
        var correct = "";

        if (results[0].totalquestions == null) {
          total_questions = 0;
          correct = 0;
        } else {
          total_questions = Number(results[0].totalquestions);
          correct = Number(results[0].correct);
        }
        console.log("Total questions " + total_questions);
        console.log("Total correct " + correct);

        //insert new total score into database

        //insert into USERS table
        var insert_score = "UPDATE USERS SET totalquestions = ?, correct = ? WHERE username = ?";

        var new_total_questions = Number(total_questions) + Number(constants.round_questions.length);
        var new_correct = Number(correct) + Number(score);

        console.log("New total questions " + new_total_questions);
        console.log("New correct " + new_correct);

        var insert_score_info = [new_total_questions, new_correct, constants.curr_user.username];

        connection.query(insert_score, insert_score_info, (error, results, fields) => {
          if (!error) {
            console.log("Inserted");

            //get the score as percentage and round to the nearest whole number
            var total_score = Math.round((new_correct / new_total_questions) * 100);

            console.log("Total score: " + total_score);

            constants.curr_user.total_score = total_score;

            //insert into SCORES table

            //check if the username exists first
            var checkUser = "SELECT * FROM SCORES WHERE USERNAME = ?";

            connection.query(checkUser, constants.curr_user.username, (error, results, fields) => {
              if (!error) {
                if (results.length > 0) {
                  //the username already exists in the table, so update
                  var update_score = "UPDATE SCORES SET total_score = ? WHERE username = ?";
                  var update_score_info = [total_score, constants.curr_user.username];
                  connection.query(update_score, update_score_info, (error, results, fields) => {
                    if (!error) {
                      console.log("Score udpated in DB");
                    }
                  });
                } else {
                  //if it doesn't exist, then insert the score
                  var insert_score_table = "INSERT INTO SCORES(username, total_score) VALUES(?, ?)";

                  var insert_score_table_info = [constants.curr_user.username, total_score];

                  connection.query(insert_score_table, insert_score_table_info, (error, results, fields) => {
                    if (!error) {
                      console.log("Inserted score into DB");
                    }
                  });
                }
              }

              var scoreboard_query = "SELECT * FROM SCORES";

              connection.query(scoreboard_query, (error, results, fields) => {
                var score_array = lib.createScoreboard(results);

                //sort array by score
                score_array.sort(function(a, b) {
                  return parseFloat(b.score) - parseFloat(a.score);
                });

                //render quiz home page with question number at 0
                res.render("quizscore", {
                  score: score,
                  round_questions: constants.round_questions,
                  total_score: total_score,
                  score_array: score_array,
                  curr_user: constants.curr_user
                });
              });

            });
          }
        });
      }
    });
    //if a user is not logged in
  } else {
    var scoreboard_query = "SELECT * FROM SCORES";

    connection.query(scoreboard_query, (error, results, fields) => {
      var score_array = lib.createScoreboard(results);

      //sort array by score
      score_array.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      //render quiz home page with question number at 0
      res.render("quizscore", {
        score: score,
        round_questions: constants.round_questions,
        score_array: score_array,
        curr_user: constants.curr_user
      });


    });
  }

});

module.exports = router;
