const User = require("./../../model/auth/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.signup = (req, res) => {
  if (
    !(
      req.body.name &&
      req.body.email &&
      req.body.password &&
      req.body.confirm_password
    )
  ) {
    res.status(422).send({ message: "Empty fields, Please try again!" });
  } else {
    User.find({ email: req.body.email }).then((user) => {
      if (user) {
        res.status(409).send({ message: "Email already exists!" });
        return;
      }
      // Save User to Database
      User.create({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password, 8),
        isRole: req.body.isRole,
      })
        .then((user) => {
          res
            .status(400)
            .send({ message: "User was registered successfully!", user: user });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });
  }
};

exports.login = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(422).send({ message: "Empty fields, Try again!" });
  }
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, match) => {
          if (err) {
            console.log("Somthing went wrong");
          }
          if (match == true) {
            var token = jwt.sign({ email: req.body.email }, "token");
            req.session.email = token;
            User.find({ email: req.body.email }, (error, data) => {
              if (!data) {
                res.status(404).send({
                  message:
                    "No user found with this credentials in our database.",
                });
              }
              req.session.user_details = data;
              //   res.redirect("/admin/dashboard");
              res
                .status(200)
                .send({ message: "You are successfully logged In!" });
            });
          } else {
            console.log("Credintial Does Not Match");
            res.status(422).send({ message: "Invalid credentials" });
          }
        });
      } else {
        console.log("No user found");
        res.status(404).send({ message: "No user found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};
