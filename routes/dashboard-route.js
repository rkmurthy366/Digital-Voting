let express = require("express");
// let auth = require('auth');
let router = express.Router();
/* GET users listing. */
router.get("/dashboard", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("dashboard.ejs", { email: req.session.emailAddress });
  } else {
    res.redirect("/login");
  }
});
module.exports = router;
