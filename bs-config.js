var express = require("express");
var app = express();
const ejs = require("ejs");
app.use(express.urlencoded());
app.use(express.static("src"));
var session = require("express-session");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// fetching table
var path = require("path");
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

// web-portion --------------------------------->
app.use(
  session({
    secret: "123456cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 300 },
  })
);

var registrationRouter = require("./routes/registration-route");
var loginRouter = require("./routes/login-route");
var logoutRouter = require("./routes/logout-route");
var adminLogin = require("./routes/admin_login");
var dashboardRouter = require("./routes/dashboard-route");
var registerRouter = require("./routes/main");
var tableview = require("./routes/table_view");

app.use("/", registrationRouter);
app.use("/", loginRouter);
app.use("/", logoutRouter);
app.use("/", adminLogin);
app.use("/", dashboardRouter);
app.use("/", registerRouter);
app.use("/", tableview);

// web-portion --------------------------------->
app.get("/candidateDetails", function (req, res) {
  res.sendFile(__dirname + "/src/adminCandidateDetails.html");
});

app.get("/addCandidate", function (req, res) {
  res.sendFile(__dirname + "/src/adminAddCandidate.html");
});

app.get("/changePhase", function (req, res) {
  res.sendFile(__dirname + "/src/adminChangePhase.html");
});

app.get("/resultAdmin", function (req, res) {
  res.sendFile(__dirname + "/src/adminResult.html");
});

app.get("/userInfo", function (req, res) {
  res.sendFile(__dirname + "/src/userInfo.html");
});

app.get("/result", function (req, res) {
  res.sendFile(__dirname + "/src/result.html");
});

module.exports = {
  notify: false,
  server: {
    baseDir: ["./src", "./build/contracts"],
    routes: {
      "/node_modules": "node_modules",
    },
    middleware: {
      1: app,
    },
  },
  port: 3000,
};
