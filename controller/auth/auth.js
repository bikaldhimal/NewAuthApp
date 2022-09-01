const User = require("./../../model/auth/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.getSignup = (req, res) => {
  res.render("auth/signup");
};

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.getUpdate = (req, res) => {
  res.render("auth/update");
};

exports.getChangePassword = (req, res) => {
  res.render("auth/changePassword");
};

exports.getResetPassword = (req, res) => {
  res.render("auth/resetPassword");
};

exports.postSignup = async (req, res) => {
  if (
    !req.body.name &&
    !req.body.email &&
    !req.body.password &&
    !req.body.confirm_password
  ) {
    console.log("Please fill all the fields and try again");
    req.flash("message", "Please fill all the fields and try again");
    return res.redirect("/signup");
  } else {
    if (req.body.password !== req.body.confirm_password) {
      req.flash("message", "Password does not match!");
      console.log("Password does not match! Please try again and signup");
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
          req.flash("message", "User created successfully!");
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

exports.postLogin = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.redirect("/login");
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
                return res.redirect("/login");
              }
              req.session.user_details = data;
              res.redirect("/admin/dashboard");
            });
          } else {
            console.log("Credintial Does Not Match");
          }
        });
      } else {
        console.log("No user found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUpdate = async (req, res) => {
  console.log(req.body);
  if (!req.body.name || !req.body.age || !req.body.phone || !req.body.address) {
    console.log("Please fill the fields and update");
  } else {
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user) {
          User.findByIdAndUpdate(user._id, ...req.body)
            .then((user) => {
              console.log("Successfully Update");
              res.redirect("/admin/dashboard");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("No user found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.postChangePassword = (req, res) => {
  if (!req.body.oldpass && !req.body.newpass1 && !req.body.newpass2) {
    console.log("Please fill all the fields and try again");
    res.redirect("/change-password");
  } else {
    if (req.body.newpass1 !== req.body.newpass2) {
      console.log("Password does not match, Recheck and try again");
    } else {
      console.log("Password Changed Successfully");
      res.redirect("/login");
    }
  }
};

exports.postResetPassword = (req, res) => {
  if (!req.body.email) {
    console.log("Empty field, please try again!");
  } else {
    console.log(
      "Password reset link has been sent to your email, Please go through your email and reset your password"
    );
    res.redirect("/reset-password");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ticketgonepal@gmail.com", // generated ethereal user
          pass: "oxwatqqrhbaljizo", // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Ticekt Go Nepal 👻" <ticektgonepal@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Scholarship Granted", // Subject line
        text: "Dear sir, you can reset your password through below link:", // plain text body
        html: '<a href="www.facebook.com">Reset-Password</a>', // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};
