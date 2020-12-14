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
  "123745007922-tskba5l8jsmfv1ok8uteg2p9dj9f74lp.apps.googleusercontent.com", //clientID
  "KAstSetFa7GlZO2SlRFOrM1b", //client secret
  "https://developers.google.com/oauthplayground" //redirect URL
);

oauth2Client.setCredentials({
     refresh_token: "1//04X1kOdvgfp3kCgYIARAAGAQSNwF-L9Ir95SyguHfmcQhW4boc6bWogQDmO5tBtBsp0lsj59k-4H2-tmJrJKvxVllrZwmFBMIBXs"
});
const accessToken = oauth2Client.getAccessToken()

router.post("/emailpw", function(req, res) {

  const username = req.body.username;

  //get the first name from the DB
  var email_query = "SELECT * FROM USERS WHERE username = ?";

  var fname = "";
  var email = "";

  sql.query(email_query, username, (err, result, fields) => {
    if (!err) {
      email = result[0].email,
        fname = result[0].fname
    }

    console.log(email);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: "123745007922-tskba5l8jsmfv1ok8uteg2p9dj9f74lp.apps.googleusercontent.com",
        clientSecret: "KAstSetFa7GlZO2SlRFOrM1b",
        refreshToken: "1//04X1kOdvgfp3kCgYIARAAGAQSNwF-L9Ir95SyguHfmcQhW4boc6bWogQDmO5tBtBsp0lsj59k-4H2-tmJrJKvxVllrZwmFBMIBXs",
        accessToken: accessToken
      },
      tls: {
          rejectUnauthorized: false
      }
    });


    var mailOptions = {
      from: 'liseidybueno@gmail.com',
      to: email,
      subject: 'Quick Trivia Reset Password',
      html: '<p>Hi, ' + fname + '!</p><p>Your username is: ' + username + '</p><p>Click here to reset password: <a href="hhttps://quicktrivia.herokuapp.com/createnew">Create New</a>'
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent");
        var error_msg = new Array();
        error_msg.push("Your email has been sent!");
        transporter.close();
        res.render("resetpassword", {
          username: username,
          curr_user: constants.curr_user,
          security_question: "",
          error_msg: error_msg
        });
      }
    });

  });

});

module.exports = router;
