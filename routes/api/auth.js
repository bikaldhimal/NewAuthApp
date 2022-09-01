const express = require("express");
const router = express.Router();

const app = express();

//controller
const authController = require("./../../controller/api/auth");

router.get("/login", authController.login);

router.post("/login", authController.login);

router.post("/signup", authController.signup);

module.exports = router;
