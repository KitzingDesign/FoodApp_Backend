const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.route("/").post(loginLimiter, authController.login);

router.route("/google").post(loginLimiter, authController.googleLogin);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

router.route("/:userId").delete(authController.deleteUser);

module.exports = router;
