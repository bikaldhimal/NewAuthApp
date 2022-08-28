const User = require("./model/auth/user");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  let hashPassword = await bcrypt.hash("password", 10);
  var user = {
    name: "admin",
    email: "admin@gmail.com",
    password: hashPassword,
    isRole: "0",
  };
  User.findOne({
    user: user.email,
  })
    .then((result) => {
      if (result) {
        console.log("Already Seeded");
        next();
      } else {
        User.create(user)
          .then((newUser) => {
            console.log("Successfully Seeded");
            next();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
