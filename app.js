const express = require("express");
const config = require("./config/config");
const path = require("path");
const mongoose = require("mongoose");
const sessions = require("express-session");
const flash = require("connect-flash");

const app = express();

//Connecting DB
mongoose.connect("mongodb://localhost:27017/Auth_App");

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "view");

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekey@bikaldhimal24525111",
    saveUninitialized: true,
    cookie: {
      maxAge: oneDay,
    },
    resave: false,
  })
);

app.use(flash());

//Setting static folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//seeeder call
const adminSeeder = require("./seeder");

//Router Calling of AUth
const authRouter = require("./routes/auth/user");

//Auth Router Register
app.use(authRouter);

//Router Calling User
// const indexRouter = require("./routes/index");

//Router register
// app.use(indexRouter);

//Router Calling for admin
const dashboardRouter = require("./routes/admin/dashboard");
// const productRouter = require("./routes/admin/product");

//admin router register
app.use("/admin", dashboardRouter);
// app.use("/admin", productRouter);

//Seeder use
app.use(adminSeeder);

app.listen(config.PORT, () => {
  console.log(`Auth app listening on port ${config.PORT}`);
});
