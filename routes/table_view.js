var express = require('express');
var db = require('../database');
var router = express.Router();

// another routes also appear here
// this script to fetch data from MySQL databse table
router.get('/table_view', function(req, res, next) {
    var sql='SELECT * FROM registered_users';
    db.query(sql, (err, data, fields) =>{
    if (err) 
    {
        console.log(err)
        throw err;
    }
    //console.log(typeof(myarray))
    // console.log(data)
    res.render('adminVoterReg', { title: 'Registered Users List', userData: data});

  });
});
module.exports = router;