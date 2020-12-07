const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lib = require('./../../index.js');
const constants = require("./../../constants.js");
const router = express.Router();


router.post("/quizquestionresult/:questionNumber", function(req, res) {

  //question number as paramter
  var questionNumberParam = req.params.questionNumber;

  var questionNumber = questionNumberParam;

  var question = "";

  //if the question number is less than the length of the array, then then
  //initialize the current question
  if (questionNumber <= constants.round_questions.length) {
    question = constants.round_questions[questionNumber - 1];
  }

  var correct_answer = question.correct_answer;
  //look for question in the quizdata

  //get the selected answer for quizquestions
  var selected_answer = req.body.answerchoice;

  var score = req.body.score;

  console.log("result page: " + score);

  //if the selected answer is correct, then increment the score
  if (selected_answer == correct_answer) {
    score++;
  }

  //render the result page
  res.render("quizquestionresult", {
    round_questions: constants.round_questions,
    questionNumber: questionNumber,
    correct_answer: correct_answer,
    selected_answer: selected_answer,
    curr_user: constants.curr_user,
    score: score
  });

});

module.exports = router;
