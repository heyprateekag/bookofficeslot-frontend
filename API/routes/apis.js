const { json } = require("body-parser");
const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

totalSlots = 50;
//get all updates
//READ
Router.get("/updates", (req, res) => {
  mysqlConnection.query("SELECT * from updates", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      res.send(err);
    }
  });
});

//get a person by id
//READ
Router.get("/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * from bookings WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//get all the available slots for a month
Router.get("/availableslots/:startDate/:endDate", (req, res) => {
  mysqlConnection.query(
    "Select * from bookmyslot.slots_availability WHERE date BETWEEN ? AND ?",
    [req.params.startDate, req.params.endDate],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//get all the users booked for a date
Router.get("/bookedusers/:date", (req, res) => {
  mysqlConnection.query(
    "SELECT * from bookmyslot.bookings WHERE bookingdate = ? AND status = ?",
    [req.params.date, "Confirmed"],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//get all the booked slots for a user
Router.get("/bookedfor/:email", (req, res) => {
  mysqlConnection.query(
    "SELECT * from bookmyslot.bookings WHERE email = ? AND status = ?",
    [req.params.email, "Confirmed"],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//get all the present and future confirmed booking details
Router.get("/bookings/:todaysdate", (req, res) => {
  mysqlConnection.query(
    "SELECT * from bookmyslot.bookings WHERE status = ? AND bookingdate >= ?",
    ["Confirmed", req.params.todaysdate],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//cancel slot
Router.post("/cancelslot", (req, res) => {
  mysqlConnection.query(
    "UPDATE bookmyslot.bookings SET status = ? WHERE email = ? AND bookingdate = ?",
    ["Cancelled", req.body.email, req.body.bookingdate],
    (err, rows, fields) => {
      if (!err) {
        mysqlConnection.query(
          "UPDATE bookmyslot.slots_availability SET available_slots = available_slots + 1 WHERE date = ?",
          [req.body.bookingdate],
          (err1, rows1, fields1) => {
            if (!err1) {
              res.send("Slot cancelled successfully!");
            } else {
              res.send(err1);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

//delete a person by id
//DELETE
Router.delete("/delete/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE from bookings WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Deleted Successfully!");
      } else {
        res.send(err);
      }
    }
  );
});

//inserting a record
//CREATE
Router.post("/add/:name/:age", (req, res) => {
  mysqlConnection.query(
    "INSERT INTO bookmyslot.bookings (name, age) VALUES (?,?)",
    [req.params.name, req.params.age],
    (err, rows, fields) => {
      if (!err) {
        res.send("New record added successfully!");
      } else {
        res.send(err);
      }
    }
  );
});

//updating a record
//UPDATE
// UPDATE `firstbackend`.`bookings` SET `name` = 'Tia Agarwal', `age` = '12' WHERE (`id` = '3');
Router.put("/update/:id", (req, res) => {
  mysqlConnection.query(
    "UPDATE bookmyslot.bookings SET name=?, age=? WHERE (id = ?)",
    [req.body.name, req.body.age, req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Record updated successfully!");
      } else {
        res.send(err);
      }
    }
  );
});

//cancel booking by admin
Router.get("/cancelbooking/:id/:reason/:date", (req, res) => {
  mysqlConnection.query(
    "UPDATE bookmyslot.bookings SET status = ?, reasonforcancel = ? WHERE id = ?",
    ["Cancelled", req.params.reason, req.params.id],
    (err, rows, fields) => {
      if (!err) {
        mysqlConnection.query(
          "UPDATE bookmyslot.slots_availability SET available_slots = available_slots + 1 WHERE date = ?",
          [req.params.date],
          (err1, rows, fields) => {
            if (!err1) {
              res.send("Slot cancelled successfully!");
            } else {
              console.log(err1);
              res.send(err1);
            }
          }
        );
      } else {
        console.log(err);
        res.send(err);
      }
    }
  );
});

//book slot
//INSERT
Router.put("/bookslot", (req, res) => {
  mysqlConnection.query(
    "INSERT INTO bookmyslot.bookings (name, email, bookingdate, remark, status) VALUES (?,?,?,?,?)",
    [
      req.body.name,
      req.body.email,
      req.body.bookingdate,
      req.body.remark,
      req.body.status,
    ],
    (err, rows, fields) => {
      if (!err) {
        mysqlConnection.query(
          "SELECT * from bookmyslot.slots_availability WHERE date = ?",
          [req.body.bookingdate],
          (err1, rows1, fields1) => {
            if (!err1) {
              //rows1.length will be 0 if no records are found
              if (rows1.length == 0) {
                //when we need to insert available slots
                mysqlConnection.query(
                  "INSERT INTO bookmyslot.slots_availability (date, available_slots) VALUES (?,?)",
                  [req.body.bookingdate, totalSlots - 1],
                  (err2, rows2, fields2) => {
                    if (!err2) {
                      res.send("Slot successfully booked");
                    } else {
                      res.send(err2);
                    }
                  }
                );
              } else {
                //when we need to update available slots
                mysqlConnection.query(
                  "UPDATE bookmyslot.slots_availability SET available_slots=available_slots-1 WHERE (date = ?)",
                  [req.body.bookingdate],
                  (err3, rows3, fields3) => {
                    if (!err3) {
                      res.send("Slot successfully booked");
                    } else {
                      res.send(err3);
                    }
                  }
                );
              }
            } else {
              res.send(err1);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

//credentials check
Router.get("/login/:username/:password", (req, res) => {
  mysqlConnection.query(
    "SELECT * from user WHERE username = ? AND password = ?",
    [req.params.username, req.params.password],
    (err, rows, fields) => {
      if (!err) {
        // res.send(rows);
        if (rows.length == 0) {
          var json = {
            login: false,
            message: "Invalid credentials",
          };
          res.send(json);
        } else {
          var json = {
            login: true,
            message: "Login Successfull!",
            // role: rows[0].role
            user: {
              name: rows[0].name,
              role: rows[0].role,
              email: rows[0].email,
            },
          };
          res.send(json);
        }
      } else {
        res.send(err);
      }
    }
  );
});

module.exports = Router;
