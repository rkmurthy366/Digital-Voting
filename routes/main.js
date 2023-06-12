require('dotenv').config();
var musername = process.env.MAIL_USERNAME
var mpass = process.env.MAIL_PASSWORD

var express = require("express");
var conn = require("../database");
var getAge = require("get-age");
var nodemailer = require("nodemailer");

var router = express.Router();

router.get("/form", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("voter-registration.ejs");
  } else {
    res.redirect("/login");
  }
});

var rand = Math.floor(Math.random() * 10000 + 54);
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "election.blockchain@gmail.com",
    user: musername,
    pass: mpass,
  },
});

var account_address;
var data;

router.post("/registerdata", function (req, res) {
  var dob = [],
    email,
    age,
    is_registerd;
  data = req.body.aadharno; //data stores aadhar no
  // console.log(data);
  account_address = req.body.account_address; //stores metamask acc address
  let sql = "SELECT * FROM aadhar_info WHERE Aadhar_No = ?";
  conn.query(sql, data, (error, results, fields) => {
    console.log("results", results);
    if (error) {
      return console.error(error.message);
    }

    if (results.length < 1){
      console.log("Invalid user", results);
      res.render("voter-registration.ejs", {
        alertMsg: "Invalid user",
      });
    }
    else {
      email = results[0].Email;
      dob = results[0].Dob;
      age = getAge(dob);
      is_registerd = results[0].Is_registered;
      if (is_registerd != "YES") {
        if (age >= 18) {
          var mailOptions = {
            from: "election.blockchain@gmail.com",
            to: email,
            subject: "Please confirm your Email account",
            text: "Hello, Your otp is " + rand,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.render("emailverify.ejs");
        } else {
          res.send("You cannot vote as your age is less than 18");
        }
      } //IF USER ALREADY REGISTERED
      else {
        res.render("voter-registration.ejs", {
          alertMsg: "You are already registered. You cannot register again",
        });
      }
    }
  });
});

router.post("/otpverify", (req, res) => {
  var otp = req.body.otp;
  if (otp == rand) {
    var record = { Account_address: account_address, Is_registered: "NO" };
    var sql = "INSERT INTO registered_users SET ?";
    conn.query(sql, record, function (err2, res2) {
      if (err2) {
        throw err2;
      } else {
        var sql1 = "Update aadhar_info set Is_registered=? Where Aadhar_No=?";
        var record1 = ["YES", data];
        conn.query(sql1, record1, function (err1, res1) {
          if (err1) {
            res.render("voter-registration.ejs");
          } else {
            console.log("1 record updated");
            var msg = "You are successfully registered";
            res.render("voter-registration.ejs", { alertMsg: msg });
          }
        });
      }
    });
  } else {
    res.render("voter-registration.ejs", {
      alertMsg: "Session Expired! , You have entered wrong OTP ",
    });
  }
});

module.exports = router;
