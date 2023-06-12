let express = require("express");
let app = express();
const ejs = require("ejs");
app.use(express.urlencoded());
app.use(express.static("src"));
let session = require("express-session");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// fetching table
let path = require("path");
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

let registrationRouter = require("./routes/registration-route");
let loginRouter = require("./routes/login-route");
let logoutRouter = require("./routes/logout-route");
let adminLogin = require("./routes/admin_login");
let dashboardRouter = require("./routes/dashboard-route");
let registerRouter = require("./routes/main");
let tableview = require("./routes/table_view");

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
