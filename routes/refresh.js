const express = require("express");
const router = express.Router();
const refreshController = require("../controllers/refreshController");
const checkAndRefreshToken = require("../middlewear/checkAndRefreshToken");

router.get("/", checkAndRefreshToken, refreshController.test);

module.exports = router;
