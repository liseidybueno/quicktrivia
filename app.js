//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const quizdata = require('./quizdata');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//function that shuffles an array f
function shuffle(array) {
  var currentIndex = array.length, temp, randomIndex;

  // While there remain elements to shuffle
  while (0 !== currentIndex) {

    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}

//create array to hold ten questions for this round
var round_questions = new Array();

//get 10 random numbers from 1 to 20 to choose 10 distinct random question
var random_num_array = new Array();

//keep track of the score
var score = 0;

//keep track of the question number
var questionNumber = 0;

//keep track of the number of quizzes to replace questions in each round
var numberOfQuizzes = 0;

//main page
app.get("/", function(req, res) {

  round_questions.length = 0;
  questionNumber = 0;
  score = 0;
  random_num_array.length = 0;

  //render quiz home page with question number at 0
  res.render("quiz", {
    questionNumber: questionNumber
  });

});

app.post("/quizquestions/:questionNumber", function(req, res) {

  //question number as paramter
  var questionNumberParam = req.params.questionNumber;

  //correct answer goes here
  var correct_answer = "";

  //variable for the current question
  var question = "";

  //if this is the first quiz, create a random array of 10 numbers
  if(numberOfQuizzes == 0){
  while (random_num_array.length < 10) {
    var rand_number = Math.floor(Math.random() * quizdata.length);
    if (random_num_array.indexOf(rand_number) === -1) {
      random_num_array.push(rand_number);
    }
  } //if there have been more quizzes, then replace the random array of 10
  //numbers with 10 other random numbers
} else {
  random_num_array = 0;
  while (random_num_array.length < 10) {
    var rand_number = Math.floor(Math.random() * quizdata.length);
    if (random_num_array.indexOf(rand_number) === -1) {
      random_num_array.push(rand_number);
    }
  }
}


  //if we're on the first question of the quiz, then create the array of questions
  //for this round:
  if(questionNumber == 0) {

    //populate this round of question's arrays
    for (var i = 0; i < 10; i++) {

      //create object for the current question
      var curr_question = new Object();

      //index for the question in the json file
      var index = random_num_array[i];

      //initialize current question object with the question and answer choices of the question atthe random index
      curr_question.question = quizdata[index].question;

      //create array to hold all 4 answer choices
      var curr_four_choices = new Array();

      //push the incorrect choices into the four choices array
      let j = 0;
      while (j < quizdata[index].incorrect.length) {
        curr_four_choices.push(quizdata[index].incorrect[j]);
        j++;
      }

      //push the correct choice into the four choices array
      curr_four_choices.push(quizdata[index].correct);

      curr_four_choices = shuffle(curr_four_choices);

      //add all 4 answer choices to the current question object
      curr_question.answerchoices = curr_four_choices;


      //add the current question to the array for this round's questions
      round_questions.push(curr_question);
    }
  }

  //if the question number is less than the length of the array, then then
  //initialize the current question
  if(questionNumber < round_questions.length){
  question = round_questions[questionNumber].question;
}

  // look for question in the quizdata
  for (var i = 0; i < quizdata.length; i++) {
    if (question === quizdata[i].question) {
      correct_answer = quizdata[i].correct;
    }
  }

  //increase question number
  questionNumber++;

    //otherwise show the next question
    res.render("quizquestions", {
      round_questions: round_questions,
      questionNumber: questionNumber,
      correct_answer: correct_answer
    });


});

app.post("/quizquestionresult/:questionNumber", function(req, res){

  //question number as paramter
  var questionNumberParam = req.params.questionNumber;

  //if the question number is less than the length of the array, then then
  //initialize the current question
  if(questionNumber <= round_questions.length){
  question = round_questions[questionNumber - 1].question;
}

  //look for question in the quizdata
  for (var i = 0; i < quizdata.length; i++) {
    if (question === quizdata[i].question) {
      correct_answer = quizdata[i].correct;
    }
  }

    //get the selected answer for quizquestions
    var selected_answer = req.body.answerchoice;

    //if the selected answer is correct, then increment the score
    if(selected_answer == correct_answer){
      score++;
    }

    //render the result page
      res.render("quizquestionresult", {
        round_questions: round_questions,
        questionNumber: questionNumber,
        correct_answer: correct_answer,
        selected_answer: selected_answer
      });


});

//quiz score page
app.get("/quizscore", function(req, res){

  res.render("quizscore", {score: score});

})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});
