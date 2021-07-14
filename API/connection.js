const mysql = require("mysql");
//for connection with database
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookmyslot",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Database Connected");
  } else {
    console.log("Database Connection failed");
  }
});

module.exports = mysqlConnection;
