const Instruction = require("../models/Instruction");

// Get all instructions for a specific recipe
const getInstructionsByRecipe = async (req, res) => {
  const { id } = req.params; // Get recipe ID from the URL
  const recipe_id = id;

  try {
    const instructions = await Instruction.findAll({
      where: { recipe_id },
      order: [["step_number", "ASC"]],
    });

    if (instructions.length === 0) {
      return res
        .status(404)
        .json({ message: "No instructions found for this recipe" });
    }

    res.json(instructions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new instruction to a specific recipe
const addInstruction = async (req, res) => {
  //   const { recipe_id } = req.query;
  console.log("Request body:", req.body); // Log the incoming request body

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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an instruction by instruction_id
const updateInstruction = async (req, res) => {
  const { instruction_id } = req.query;
  const { step_number, instruction_text } = req.body;

  try {
    const instruction = await Instruction.findByPk(instruction_id);

    if (!instruction) {
      return res.status(404).json({ message: "Instruction not found" });
    }

    instruction.step_number = step_number || instruction.step_number;
    instruction.instruction_text =
      instruction_text || instruction.instruction_text;

    await instruction.save();
    res.json(instruction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an instruction by instruction_id
const deleteInstruction = async (req, res) => {
  const { instruction_id } = req.query;

  try {
    const instruction = await Instruction.findByPk(instruction_id);

    if (!instruction) {
      return res.status(404).json({ message: "Instruction not found" });
    }

    await instruction.destroy();
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
