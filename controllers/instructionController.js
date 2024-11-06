const Instruction = require("../models/Instruction");

// Utility function for error handling
const handleError = (res, error) => {
  console.error(error);
  return res
    .status(500)
    .json({ message: "Internal server error", error: error.message });
};

// Get all instructions for a specific recipe
const getInstructionsByRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const instructions = await Instruction.findAll({
      where: { recipe_id: id },
      order: [["step_number", "ASC"]],
    });

    if (!instructions.length) {
      return res
        .status(404)
        .json({ message: "No instructions found for this recipe" });
    }

    res.json(instructions);
  } catch (error) {
    console.error(error);
    handleError(res, error);
  }
};

// Add a new instruction to a specific recipe
const addInstruction = async (req, res) => {
  const { step_number, instruction_text, recipe_id } = req.body;

  if (step_number === null || !instruction_text) {
    return res
      .status(400)
      .json({ message: "Step number and instruction text are required" });
  }

  try {
    const newInstruction = await Instruction.create({
      recipe_id,
      step_number,
      instruction_text,
    });

    res.status(201).json(newInstruction);
  } catch (error) {
    handleError(res, error);
  }
};

// Update an instruction by instruction_id
const updateInstruction = async (req, res) => {
  const { instruction_id } = req.query;
  const { step_number, instruction_text } = req.body;

  try {
    const existingInstruction = await Instruction.findByPk(instruction_id);

    if (!existingInstruction) {
      return res.status(404).json({ message: "Instruction not found" });
    }

    existingInstruction.step_number =
      step_number || existingInstruction.step_number;
    existingInstruction.instruction_text =
      instruction_text || existingInstruction.instruction_text;

    await existingInstruction.save();
    res.json(existingInstruction);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete an instruction by instruction_id
const deleteInstruction = async (req, res) => {
  const { instruction_id } = req.query;

  try {
    const existingInstruction = await Instruction.findByPk(instruction_id);

    if (!existingInstruction) {
      return res.status(404).json({ message: "Instruction not found" });
    }

    await existingInstruction.destroy();
    res.json({ message: "Instruction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getInstructionsByRecipe,
  addInstruction,
  updateInstruction,
  deleteInstruction,
};
