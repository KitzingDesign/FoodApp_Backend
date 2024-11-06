// instructionRouter.js
const express = require("express");
const {
  getInstructionsByRecipe,
  addInstruction,
  updateInstruction,
  deleteInstruction,
} = require("../controllers/instructionController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

// Routes for handling instructions

// Making the route private
router.use(verifyJWT);

// @route get /instruction
// @desc get all instructions for a recipe
// @access Private
router.get("/:id", getInstructionsByRecipe);

// @route post /instruction
// @desc create a new instruction
// @access Private
router.post("/", addInstruction);

// @route PATCH /instruction
// @desc Update an existing instruction
// @access Private
router.patch("/", updateInstruction);

// @route delete /instruction
// @desc delete an existing instruction
// @access Private
router.delete("/", deleteInstruction);

module.exports = router;
