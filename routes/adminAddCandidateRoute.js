let express = require("express");
// let auth = require('auth');
let router = express.Router();
/* GET users listing. */
router.get("/addCandidate", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("adminAddCandidate.ejs", { email: req.session.emailAddress });
  } else {
    res.redirect("/adminLogin");
  }
});
module.exports = router;
