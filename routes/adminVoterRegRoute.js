let express = require("express");
let db = require("../database");
let router = express.Router();

// another routes also appear here
// this script to fetch data from MySQL databse table

router.get("/adminVoterReg", function (req, res, next) {
  if (req.session.loggedinUser) {
    let sql = "SELECT * FROM registered_users";
    db.query(sql, (err, data, fields) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.render("adminVoterReg.ejs", {
        userData: data,
        email: req.session.emailAddress,
      });
    });
  } else {
    res.redirect("/adminLogin");
  }
});
module.exports = router;
