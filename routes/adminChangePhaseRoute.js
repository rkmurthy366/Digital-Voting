let express = require("express");
// let auth = require('auth');
let router = express.Router();
/* GET users listing. */
router.get("/changePhase", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("adminChangePhase.ejs", { email: req.session.emailAddress });
  } else {
    res.redirect("/adminLogin");
  }
});
module.exports = router;
