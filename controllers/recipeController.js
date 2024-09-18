// controllers/recipeController.js
const Recipe = require("../models/Recipe"); // Your Recipe model
const User = require("../models/User"); // Your User model

// Create new recipe for user
exports.createRecipe = async (req, res) => {
  const { title, description, instructions, image_url, user_id } = req.body;

  // Confirm data
  if (!title) {
    return res.status(400).json({ message: "Title are required" });
  }

  try {
    const recipeObject = {
      user_id,
      title,
      description,
      instructions,
      image_url,
    };
    const newRecipe = await Recipe.create(recipeObject); // Create the new recipe
    res.status(201).json({ message: `New recipe ${newRecipe.title} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update a recipe
// @route PATCH /recipes
// @access Private
exports.updateRecipe = async (req, res) => {
  const { title, description, instructions, image_url, id } = req.body;

  // Confirm data
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    // Confirm recipe exists to update
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Update recipe details
    recipe.title = title;
    recipe.description = description;
    recipe.instructions = instructions;
    recipe.image_url = image_url;

    // Save updated recipe
    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: `'${updatedRecipe.title}' updated`,
      recipe: updatedRecipe,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a recipe
// @route DELETE /recipes
// @access Private
exports.deleteRecipe = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Recipe ID required" });
  }

  try {
    // Confirm recipe exists to delete
    const recipe = Recipe.findOne({
      where: { recipe_id: id },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete recipe
    await Recipe.destroy({
      where: { recipe_id: id },
    });

    res.status(200).json({
      message: `Recipe '${recipe.title}' with ID ${recipe.id} deleted`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
