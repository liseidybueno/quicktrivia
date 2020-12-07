const passwordValidator = require('password-validator');

//function that shuffles an array
function shuffle(array) {
  var currentIndex = array.length,
    temp, randomIndex;

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

function validatePWMsg(viewList){
  var custom_msgs = new Array();
  //loop through the list and create custom messages. store messages in array.
  for (var i = 0; i < viewList.length; i++) {
    //if the error is min:
    if (viewList[i] == "min") {
      custom_msgs.push("Your password should be at least six characters.");
    } else if (viewList[i] == "uppercase") {
      custom_msgs.push("Your password should contain at least one uppercase letter.");
    } else if (viewList[i] == "digits") {
      custom_msgs.push("Your password should contain at least one digit.");
    } else if (viewList[i] == "lowercase") {
      custom_msgs.push("Your password should contain at least one lowercase letter.");
    } else if (viewList[i] == "max") {
      custom_msgs.push("Your password should be less than fifty characters.");
    } else if (viewList[i] == "spaces") {
      custom_msgs.push("Your password should not contain any spaces.");
    }

  }

  return custom_msgs;
}

function createScoreboard(results){
  var score_array = new Array();
  if(results.length > 0){
    for (var i = 0; i < results.length; i++) {
      //create object that holds user and score
      var user_score = new Object();
      user_score.username = results[i].username;
      user_score.score = results[i].total_score;

      //push into array
      score_array.push(user_score);
    }
  }

  return score_array;
}

//create schema for password validator
const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(6)
  .is().max(50)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();

//create schema for username validator
const usernameSchema = new passwordValidator();

usernameSchema
  .has().not().spaces()
  .is().min(4);


module.exports = {createScoreboard, validatePWMsg, shuffle, passwordSchema, usernameSchema}
