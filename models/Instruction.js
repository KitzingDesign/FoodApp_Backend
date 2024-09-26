const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Recipe = require("./Recipe");

const Instruction = sequelize.define(
  "Instruction",
  {
    instruction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recipe, // Reference to the Recipe model
        key: "recipe_id",
      },
      onDelete: "CASCADE", // Delete instructions if the recipe is deleted
    },
    step_number: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure that each instruction has a step number
    },
    instruction_text: {
      type: DataTypes.TEXT,
      allowNull: false, // The instruction must have a text description
    },
  },
  {
    tableName: "instructions", // Explicitly defining table name
    timestamps: false, // Disable automatic timestamps since we're not using created_at/updated_at fields
  }
);

// An Instruction belongs to a Recipe
Instruction.belongsTo(Recipe, {
  foreignKey: "recipe_id",
  as: "recipe", // Alias for the associated Recipe
  onDelete: "CASCADE", // If a Recipe is deleted, delete associated Instructions
});

module.exports = Instruction;
