// controllers/recipeController.js
const Recipe = require("../models/Recipe"); // Your Recipe model
const User = require("../models/User"); // Your User model

// Create new recipe for user
exports.createRecipe = async (res, req) => {
  const { title, description, instructions, image_url } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and req.user contains the user info (have a look how this actually works)

  // Confirm data
  if (!title || !userId) {
    return res.status(400).json({ message: "Title are required" });
  }

  try {
    const recipeObject = {
      user_id: userId,
      title,
      description,
      instructions,
      image_url,
    };
    const newRecipe = await Recipe.create(recipeObject);
  } catch (err) {
    res.sendStatus(500);
  }
};
