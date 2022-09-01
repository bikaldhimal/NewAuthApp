const express = require("express");
const router = express.Router();

const app = express();

//controller
const authController = require("./../../controller/api/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

module.exports = router;
