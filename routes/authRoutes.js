const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");
const verifyJWT = require("../middleware/verifyJWT");

// @route post /auth
// @desc login a user with email and password
// @access Public
router.route("/").post(loginLimiter, authController.login);

// @route post /auth/google
// @desc login a user with googleAuth
// @access Public
router.route("/google").post(loginLimiter, authController.googleLogin);

// @route get /auth/refresh
// @desc refresh token
// @access Public
router.route("/refresh").get(authController.refresh);

// Making the route private
router.use(verifyJWT);

// @route post /auth/logout
// @desc logout user
// @access Private
router.route("/logout").post(authController.logout);

// @route delete /auth/{userId}
// @desc delete a user
// @access Private
router.route("/:userId").delete(authController.deleteUser);

module.exports = router;
