const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const uploadProfileImg = require("../middleware/uploadProfileImg");
const verifyJWT = require("../middleware/verifyJWT");

// No authentication required for user registration
router.post("/", usersController.createNewUser);

router.use(verifyJWT);

router.get("/:userId", usersController.getUser);

router.patch("/", uploadProfileImg.single("image"), usersController.updateUser);

module.exports = router;
