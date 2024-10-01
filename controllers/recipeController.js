// controllers/recipeController.js
const Recipe = require("../models/Recipe"); // Your Recipe model
const User = require("../models/User"); // Your User model
const { scrapeRecipe } = require("../services/recipeScraper");

// Import the upload middleware
const upload = require("../middleware/upload");

// Get all recipes for a user
exports.getAllRecipes = async (req, res) => {
  const { user_id } = req.query;

  // Validate request
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const recipes = await Recipe.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    // Convert the result to plain JSON
    const plainRecipes = recipes.map((recipe) => recipe.get({ plain: true }));

    if (!recipes.length) {
      return res
        .status(404)
        .json({ message: "No recipes found for this user" });
    }

    res.status(200).json(plainRecipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one recipe by ID and user ID
exports.getOneRecipe = async (req, res) => {
  const { id } = req.params; // Get recipe ID from the URL

  // Validate input
  if (!id) {
    return res
      .status(400)
      .json({ message: "Recipe ID and User ID are required." });
  }

  try {
    const recipe = await Recipe.findOne({
      where: {
        recipe_id: id,
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Convert to plain JSON if using Sequelize
    res.status(200).json(recipe.get({ plain: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new recipe for user
exports.createRecipe = async (req, res) => {
  // Use multer's upload middleware here
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { title, description, user_id, collection_id } = req.body;
    let image_url = null;

    // Confirm data
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // If an image was uploaded, use the Cloudinary URL
    if (req.file) {
      image_url = req.file.path; // This is the Cloudinary URL from multer
    } else {
      image_url = req.body.image_url; // Use the URL from the form
    }
    console.log("Image URL:", image_url);

    try {
      const recipeObject = Number(collection_id)
        ? {
            user_id,
            title,
            description,
            image_url,
            collection_id,
          }
        : { user_id, title, description, image_url };
      const newRecipe = await Recipe.create(recipeObject); // Create the new recipe
      res.status(201).json({
        message: `New recipe ${newRecipe.title} created`,
        recipe_id: newRecipe.recipe_id,
        recipe: newRecipe,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// @desc Update a recipe
// @route PATCH /recipes
// @access Private
exports.updateRecipe = async (req, res) => {
  const { title, description, image_url, id } = req.body;

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
  const { recipe_id } = req.query;

  // Confirm data
  if (!recipe_id) {
    return res.status(400).json({ message: "Recipe ID required" });
  }

  try {
    // Confirm recipe exists to delete
    const recipe = Recipe.findOne({
      where: { recipe_id },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete recipe
    await Recipe.destroy({
      where: { recipe_id },
    });

    res.status(200).json({
      message: `Recipe deleted`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get a recipe from url
// @route GET /recipes
// @access Private
exports.getUrlRecipe = async (req, res) => {
  const { url } = req.query;

  // Check if URL was provided
  if (!url) {
    return res.status(400).json({ message: "Recipe URL is required" });
  }

  try {
    const recipe = await scrapeRecipe(url);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
