const express = require("express");
const router = express.Router();

const app = express();

//middleware
const authMiddleware = require("./../../middleware/auth/verifyLogin");

//controller
const dashboardController = require("./../../controller/admin/dashboard");

router.get("/dashboard", authMiddleware, dashboardController.getDashboard);

module.exports = router;
