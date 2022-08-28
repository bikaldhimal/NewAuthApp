const express = require("express");
const router = express.Router();

const app = express();

//controller
const authController = require("./../../controller/auth/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/logout", authController.logout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/update", authController.getUpdate);

router.post("/update", authController.postUpdate);

router.get("/change-password", authController.getChangePassword);

router.post("/change-password", authController.postChangePassword);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

module.exports = router;
