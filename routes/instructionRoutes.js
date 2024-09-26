// instructionRouter.js
const express = require("express");
const {
  getInstructionsByRecipe,
  addInstruction,
  updateInstruction,
  deleteInstruction,
} = require("../controllers/instructionController");

const router = express.Router();

// Routes for handling instructions

// Get all instructions for a specific recipe
router.get("/:id", getInstructionsByRecipe);

// Add a new instruction to a specific recipe
router.post("/", addInstruction);

// @route PATCH /ingredient
// @desc Update an existing instruction
// @access Private
router.patch("/", updateInstruction);

// Delete a specific instruction by instruction_id
router.delete("/", deleteInstruction);

module.exports = router;
