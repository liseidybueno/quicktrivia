//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const lib = require('./../index.js');
const sql = require("./../config.js");
const constants = require("./../constants.js");
const router = express.Router();

const oauth2Client = new OAuth2(
  process.env.CLIENTID, //clientID
  process.env.CLIENTSECRET, //client secret
  "https://developers.google.com/oauthplayground" //redirect URL
);

oauth2Client.setCredentials({
     refresh_token: process.env.REFRESHTOKEN
});
const accessToken = oauth2Client.getAccessToken()

router.post("/emailpw", function(req, res) {

  const username = req.body.username;

  //get the first name from the DB
  var email_query = "SELECT * FROM USERS WHERE username = ?";

  var error_msg = new Array();

  if(username == ""){
    error_msg.push("Please enter a valid username.");
    res.render("resetpassword", {
      username: username,
      curr_user: constants.curr_user,
      security_question: "",
      error_msg: error_msg
    });
  } else {
    sql.query(email_query, username, (err, result, fields) => {
      if (!err) {

        if(result.length > 0){
          var fname = "";
          var email = "";

          email = result[0].email,
          fname = result[0].fname,

        console.log(email);

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            refreshToken: process.env.REFRESHTOKEN,
            accessToken: accessToken
          }
        });


        var mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Quick Trivia Reset Password',
          html: '<p>Hi, ' + fname + '!</p><p>Your username is: ' + username + '</p><p>Click here to reset password: <a href="https://quicktrivia.herokuapp.com/createnew">Create New</a>'
        }

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            var error_msg = new Array();
            error_msg.push("Your email has been sent!");
            res.render("resetpassword", {
              username: username,
              curr_user: constants.curr_user,
              security_question: "",
              error_msg: error_msg
            });
          }
        });
      } else {
    error_msg.push("Please enter a valid username.");
    res.render("resetpassword", {
      username: username,
      curr_user: constants.curr_user,
      security_question: "",
      error_msg: error_msg
    });
  }
  }

  });

}

});

module.exports = router;
