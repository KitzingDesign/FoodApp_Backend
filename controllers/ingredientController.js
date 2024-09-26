const Ingredient = require("../models/Ingredient"); // Your Ingredient model
const Recipe = require("../models/Recipe"); // Your Recipe model

// Get all ingredients for a recipe
exports.getAllIngredients = async (req, res) => {
  const { id } = req.params; // Get recipe ID from the URL
  const recipe_id = id;

  // Validate request
  if (!recipe_id) {
    return res.status(400).json({ message: "Recipe ID is required." });
  }

  try {
    const ingredients = await Ingredient.findAll({
      where: { recipe_id },
    });

    // Convert the result to plain JSON
    const plainIngredients = ingredients.map((ingredient) =>
      ingredient.get({ plain: true })
    );

    if (!ingredients.length) {
      return res
        .status(404)
        .json({ message: "No ingredients found for this recipe" });
    }

    res.status(200).json(plainIngredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new ingredient for a recipe
exports.createIngredient = async (req, res) => {
  const { name, recipe_id } = req.body;

  // Confirm data
  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required" });
  }

  try {
    const ingredientObject = {
      recipe_id,
      name,
    };
    const newIngredient = await Ingredient.create(ingredientObject); // Create the new ingredient
    res.status(201).json({
      message: `New ingredient ${newIngredient.name} created`,
      ingredient_id: newIngredient.ingredient_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an ingredient
exports.updateIngredient = async (req, res) => {
  const { ingredient_id } = req.query;
  const { name } = req.body;

  // Confirm data
  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required" });
  }

  try {
    // Confirm ingredient exists to update
    const ingredient = await Ingredient.findByPk(ingredient_id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Update ingredient details
    ingredient.name = name;

    // Save updated ingredient
    const updatedIngredient = await ingredient.save();

    res.status(200).json({
      message: `'${updatedIngredient.name}' updated`,
      ingredient: updatedIngredient,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an ingredient
exports.deleteIngredient = async (req, res) => {
  const { ingredient_id } = req.body;

  // Confirm data
  if (!ingredient_id) {
    return res.status(400).json({ message: "Ingredient ID is required" });
  }

  try {
    // Confirm ingredient exists to delete
    const ingredient = await Ingredient.findOne({
      where: { ingredient_id },
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Delete ingredient
    await Ingredient.destroy({
      where: { ingredient_id },
    });

    res.status(200).json({
      message: `Ingredient '${ingredient.name}' with ID ${ingredient.ingredient_id} deleted`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
