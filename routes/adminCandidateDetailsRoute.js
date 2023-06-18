let express = require("express");
// let auth = require('auth');
let router = express.Router();
/* GET users listing. */
router.get("/candidateDetails", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("adminCandidateDetails.ejs", { email: req.session.emailAddress });
  } else {
    res.redirect("/adminLogin");
  }
});
module.exports = router;
