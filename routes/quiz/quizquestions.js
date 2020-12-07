//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const Entities = require("html-entities").AllHtmlEntities;
var mysql = require("mysql");
let config = require("./../../db.js");
const lib = require('./../../index.js');
let connection = mysql.createConnection(config);
const constants = require("./../../constants.js");
const router = express.Router();

const entities = new Entities();

router.post("/quizquestions/:questionNumber", function(req, res) {

  //question number as paramter
  var questionNumberParam = req.params.questionNumber;

  var questionNumber = questionNumberParam;

  //correct answer goes here
  var correct_answer = "";

  //variable for the current question
  var question = "";

  //get the category and # of questions
  var category = req.body.category;

  var amount = req.body.number;

  var score = req.body.score;
  console.log("question page: " + score);

  //get the data from the API

  const api_url = "https://opentdb.com/api.php?type=multiple&category=" + category + "&amount=" + amount;

  https.get(api_url, function(response) {

    response.on("data", function(data) {
      const quizQuestions = JSON.parse(data);

      //if we're on the first question of the quiz, then create the array of questions
      //for this round:
      if (questionNumber == 0) {

        for (var i = 0; i < quizQuestions.results.length; i++) {
          const curr_question = new Object();
          var all_choices = new Array();
          all_choices.push(entities.decode(quizQuestions.results[i].correct_answer));
          for (var j = 0; j < quizQuestions.results[i].incorrect_answers.length; j++) {
            all_choices.push(entities.decode(quizQuestions.results[i].incorrect_answers[j]));
          }

          curr_question.question = entities.decode(quizQuestions.results[i].question);

          //shuffle all_answers
          all_choices = lib.shuffle(all_choices);
          curr_question.answerchoices = all_choices;
          curr_question.correct_answer = entities.decode(quizQuestions.results[i].correct_answer);

          constants.round_questions.push(curr_question);

        }
      }

      //if the question number is less than the length of the array but not 0, then
      //initialize the current question

      if (questionNumber < constants.round_questions.length) {
        question = constants.round_questions[questionNumber].question;
      }

      questionNumber++;

      //otherwise show the next question
      res.render("quizquestions", {
        round_questions: constants.round_questions,
        questionNumber: questionNumber,
        curr_user: constants.curr_user,
        score: score
      });

    });
  });

});

module.exports = router;
