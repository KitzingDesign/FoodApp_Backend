const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const uploadProfileImg = require("../middleware/uploadProfileImg");
const verifyJWT = require("../middleware/verifyJWT");

// @route post /user
// @desc create a new user
// @access Public
router.post("/", usersController.createNewUser);

// private routes
router.use(verifyJWT);

// @route get /user/:userId
// @desc get a user by id
// @access Private
router.get("/:userId", usersController.getUser);

// @route patch /user
// @desc update user
// @access Private
router.patch("/", uploadProfileImg.single("image"), usersController.updateUser);

module.exports = router;
