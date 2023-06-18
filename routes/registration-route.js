require("dotenv").config();
let musername = process.env.MAIL_USERNAME;
let mpass = process.env.MAIL_PASSWORD;
let nodemailer = require("nodemailer");
let express = require("express");
let router = express.Router();
let db = require("../database");
let app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

let rand = Math.floor(Math.random() * 1000000 + 3454);
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "election.blockchain@gmail.com",
    user: musername,
    pass: mpass,
  },
});

// to display registration form
router.get("/register", function (req, res, next) {
  res.render("registration-form.ejs");
});

// to store user input detail on post request
router.post("/register", function (req, res, next) {
  inputData = {
    first_name: req.body.first_name,
    email_address: req.body.email_address,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  };

  // check unique email address
  let sql = "SELECT * FROM registration WHERE email_address = ?";
  db.query(sql, [inputData.email_address], function (err, data, fields) {
    if (err) throw err;
    let msg = "";
    if (data.length > 0) {
      let msg = "Can't Register!! Email already exist";
      res.render("registration-form.ejs", { alertMsg: msg });
    } else if (inputData.confirm_password != inputData.password) {
      let msg = "Password & Confirm Password do not Matched";
      res.render("registration-form.ejs", { alertMsg: msg });
    } else if (inputData.password.length < 8) {
      let msg = "Your password must be at least 8 characters";
      res.render("registration-form.ejs", { alertMsg: msg });
    } else {
      console.log("mailoptions")
      let mailOptions = {
        from: "election.blockchain@gmail.com",
        to: inputData.email_address,
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
      res.render("verifyEmail.ejs");
    }
  });
});

router.post("/verifyEmailOTP", (req, res) => {
  let otp = req.body.otp;
  if (otp == rand) {
    // save users data into database
    let sql = "INSERT INTO registration SET ?";
    const mdata = {
      first_name: inputData.first_name,
      email_address: inputData.email_address,
      password: inputData.password,
    };
    db.query(sql, mdata, function (err, data) {
      if (err) console.log(err);
    });
    let msg = "Your are successfully registered. Please login";
    res.render("registration-form.ejs", { alertMsg: msg });
  } else {
    res.render("registration-form.ejs", {
      alertMsg: "Session Expired! , You have entered wrong OTP ",
    });
  }
});

module.exports = router;
