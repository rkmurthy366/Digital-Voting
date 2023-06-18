let express = require("express");
// let auth = require('auth');
let router = express.Router();
/* GET users listing. */
router.get("/voting", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("userVoting.ejs", { email: req.session.emailAddress });
  } else {
    res.redirect("/login");
  }
});
module.exports = router;
