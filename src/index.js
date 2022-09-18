require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const database = require("../config/connection");
const auth = require("../routes/auth");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 3434;

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// test routes
app.get("/", (req, res) => {
  res.send("You've reached the Auth service");
});
app.post("/", (req, res) => {
  res.send("You've reached the Auth service");
});

// Load Routes
app.use("/", auth);

// Database connection
database.connectToServer(function (err) {
  if (err) console.error(err);
});

//Passport middleware
app.use(passport.initialize());

// Passport config
require("../config/passport")(passport);

app.listen(port, () => {
  console.log(`Auth service is now running at port: ${port}`);
});
