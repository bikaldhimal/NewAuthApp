const User = require("./../../model/auth/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.getLogin = (req, res) => {
  if (!req.body.email) {
    res.status(422).send({ message: "Please provide your email" });
  } else {
    res.status(200).send({ message: "Welcome to Login Page!" });
  }
};

exports.postLogin = (req, res) => {
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

exports.postSignup = async (req, res) => {
  if (
    !req.body.name &&
    !req.body.email &&
    !req.body.password &&
    !req.body.confirm_password
  ) {
    console.log("Please fill all the fields and try again");
    res.status(422).send({ message: "Empty Fields, Please try again!" });
    // req.flash("message", "Please fill all the fields and try again");
    // return res.redirect("/signup");
  } else {
    if (req.body.password !== req.body.confirm_password) {
      // req.flash("message", "Password does not match!");
      // console.log("Password does not match! Please try again and signup");
      res.status(422).send({ message: "Password does not match!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      encryptedPass = await bcrypt.hash(req.body.password, salt);
      // let data = {
      //   ...req.body,
      // };
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPass,
      })
        .then((result) => {
          // req.flash("message", "User created successfully!");
          console.log("User created successfully!");
          res.redirect("/login");
        })
        .catch((err) => {
          req.flash("message", "Failed to create user account");
          console.log(err);
        });
    }
  }
};
