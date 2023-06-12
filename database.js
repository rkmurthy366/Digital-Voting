require('dotenv').config();
let dbPass = process.env.DB_PASSWORD

let mysql = require('mysql2');
let conn = mysql.createConnection({
  host: 'localhost', // assign your host name
  user: 'root',      //  assign your database username
  password: dbPass,      // assign your database password
  database: 'aadhar' // assign database Name
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;