let express = require("express");

let router = express.Router();
let db = require("../database");
let app = express();
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("login-form.ejs");
});

router.post("/login", function (req, res) {
  let emailAddress = req.body.email_address;
  let password = req.body.password;

  let sql = "SELECT * FROM registration WHERE email_address =? AND password =?";
  db.query(sql, [emailAddress, password], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.emailAddress = emailAddress;
      res.redirect("/userInfo");
    } else {
      res.render("login-form.ejs", {
        alertMsg: "Your Email Address or password is wrong",
      });
    }
  });
});

module.exports = router;
