const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Recipe = require("./Recipe");

const Ingredient = sequelize.define(
  "Ingredient",
  {
    ingredient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
  },
  {
    tableName: "ingredients",
    timestamps: false, // Disable automatic timestamps if not needed
  }
);

// An Instruction belongs to a Recipe
Ingredient.belongsTo(Recipe, {
  foreignKey: "recipe_id",
  as: "recipe", // Alias for the associated Recipe
  onDelete: "CASCADE", // If a Recipe is deleted, delete associated Instructions
});

module.exports = Ingredient;
