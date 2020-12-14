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
//
// const oauth2Client = new OAuth2(
//   "123745007922-tskba5l8jsmfv1ok8uteg2p9dj9f74lp.apps.googleusercontent.com", //clientID
//   "KAstSetFa7GlZO2SlRFOrM1b", //client secret
//   "https://developers.google.com/oauthplayground" //redirect URL
// );

// oauth2Client.setCredentials({
//      refresh_token: "1//04X1kOdvgfp3kCgYIARAAGAQSNwF-L9Ir95SyguHfmcQhW4boc6bWogQDmO5tBtBsp0lsj59k-4H2-tmJrJKvxVllrZwmFBMIBXs"
// });
// const accessToken = oauth2Client.getAccessToken()

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
            user: "liseidybueno@gmail.com",
            clientId: "469086209980-bh0m4qnc1slafpv5iuktf1j4j7bq3b1t.apps.googleusercontent.com",
            clientSecret: "AXc5hXYAKS-fEx9IdKGjgh4B",
            refreshToken: "1//04JuMpHhAtBC5CgYIARAAGAQSNwF-L9Ir-Pw7i00N0C3eZjy9sZum2fxhlKJQeDQ62NxpU_4Shi5dE6TZeHgsd8KerZt64gGLiEE",
            accessToken: "ya29.a0AfH6SMB8ofqYLwCX5fUBmrFsRhwZSFveGqXuFcyQLwvZ4JToLn8YDTP3YL8m_E41lYLag5_R0KEtaooa8cOhxgFnHHf9JVMS1GuAywCNRV-0Lb-ITo1HXvOFTr4FIDcIXiyCfq1EGq82JcV4uGPWVGJrUi6F3O9QBqL6ubHPK_c"
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



// var transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     type: 'OAuth2',
//         user: process.env.EMAIL,
//         clientId: "123745007922-tskba5l8jsmfv1ok8uteg2p9dj9f74lp.apps.googleusercontent.com",
//         clientSecret: "KAstSetFa7GlZO2SlRFOrM1b",
//         refreshToken: "1//04X1kOdvgfp3kCgYIARAAGAQSNwF-L9Ir95SyguHfmcQhW4boc6bWogQDmO5tBtBsp0lsj59k-4H2-tmJrJKvxVllrZwmFBMIBXs",
//        accessToken: accessToken
//   }
// });

  });

}

});

module.exports = router;
