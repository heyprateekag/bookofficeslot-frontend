const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const PeopleRoutes = require("./routes/apis");

var app = express();

app.use(bodyParser.json());

// to handle Cors Policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/", PeopleRoutes);

app.listen(8080);
//npm run serve //command to run the code
