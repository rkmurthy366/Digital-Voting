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

let registrationRouter = require("./routes/registrationRoute");
let loginRouter = require("./routes/loginRoute");
let logoutRouter = require("./routes/logoutRoute");
let adminLogin = require("./routes/adminLoginRoute");
let userInfoRoute = require("./routes/userInfoRoute");
let userVotingRegRoute = require("./routes/userVotingRegRoute");
let userVotingRoute = require("./routes/userVotingRoute");
let userResultRoute = require("./routes/userResultRoute");
let adminCandidateDetailsRoute = require("./routes/adminCandidateDetailsRoute");
let adminAddCandidateRoute = require("./routes/adminAddCandidateRoute");
let adminVoterRegRoute = require("./routes/adminVoterRegRoute");
let adminChangePhaseRoute = require("./routes/adminChangePhaseRoute");
let adminResultRoute = require("./routes/adminResultRoute");

app.use("/", registrationRouter);
app.use("/", loginRouter);
app.use("/", logoutRouter);
app.use("/", adminLogin);
app.use("/", userInfoRoute);
app.use("/", userVotingRegRoute);
app.use("/", userVotingRoute);
app.use("/", userResultRoute);
app.use("/", adminCandidateDetailsRoute);
app.use("/", adminAddCandidateRoute);
app.use("/", adminVoterRegRoute);
app.use("/", adminChangePhaseRoute);
app.use("/", adminResultRoute);

// web-portion --------------------------------->
// app.get("/candidateDetails", function (req, res) {
//   res.sendFile(__dirname + "/src/adminCandidateDetails.html");
// });

// app.get("/addCandidate", function (req, res) {
//   res.sendFile(__dirname + "/src/adminAddCandidate.html");
// });

// app.get("/changePhase", function (req, res) {
//   res.sendFile(__dirname + "/src/adminChangePhase.html");
// });

// app.get("/resultAdmin", function (req, res) {
//   res.sendFile(__dirname + "/src/adminResult.html");
// });

// app.get("/userInfo", function (req, res) {
//   res.sendFile(__dirname + "/src/userInfo.html");
// });

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
