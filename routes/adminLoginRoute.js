let express = require("express");
let db = require("../database");

let router = express.Router();
let app = express();
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
/* GET users listing. */
router.get("/adminLogin", function (req, res, next) {
  res.render("adminLogin.ejs");
});

router.post("/adminLogin", function (req, res) {
  let emailAddress = req.body.email_address;
  let password = req.body.password;

  let sql = "SELECT * FROM admin WHERE email_address =? AND password =?";
  db.query(sql, [emailAddress, password], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.emailAddress = emailAddress;
      res.redirect("/addCandidate");
    } else {
      res.render("adminLogin.ejs", {
        alertMsg: "Your Email Address or password is wrong",
      });
    }
  });
});

module.exports = router;
