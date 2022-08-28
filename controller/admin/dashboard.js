const User = require("./../../model/auth/user");

exports.getDashboard = (req, res) => {
  User.findOne({ name: req.session.user_details[0].name })
    .then((user) => {
      if (user) {
        res.render("admin/dashboard", { data: user });
      } else {
        console.log("Data not found");
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
  // console.log("Hello");
  // console.log(req.session.user_details[0].name);
};
