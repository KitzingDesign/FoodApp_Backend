const express = require("express");
const router = express.Router(); // Import the express router
const authController = require("../controllers/authController");

router.post("/", authController.handleLogin);

module.exports = router;
