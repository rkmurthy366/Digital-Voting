let express = require("express");
let router = express.Router();
let db = require("../database");
let app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

// to display registration form
router.get("/register", function (req, res, next) {
  res.render("registration-form.ejs");
  // location.reload();
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
    let msg = ""
    if (data.length > 0) {
      let msg = "Can't Register!! Email already exist";
      res.render("registration-form.ejs", { alertMsg: msg });
    } 
    else if (inputData.password.length < 8) {
      let msg = "Your password must be at least 8 characters";
    } 
    else if (inputData.confirm_password != inputData.password) {
      let msg = "Password & Confirm Password do not Matched";
    } else {
      // save users data into database
      let sql = "INSERT INTO registration SET ?";
      const mdata = {
        first_name: inputData.first_name,
        email_address: inputData.email_address,
        password: inputData.password
      }
      db.query(sql, mdata, function (err, data) {
        if (err) console.log(err);
      });
      let msg = "Your are successfully registered. Please login";
    }
    res.render("registration-form.ejs", { alertMsg: msg });
  });
});

module.exports = router;
