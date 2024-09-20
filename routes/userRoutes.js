const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

// No authentication required for user registration
router.post("/", usersController.createNewUser);

router.use(verifyJWT);

router.route("/:userId").get(usersController.getUser);

module.exports = router;
