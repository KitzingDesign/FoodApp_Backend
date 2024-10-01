// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const verifyJWT = require("../middleware/verifyJWT");

// Create a new recipe with an image (Authenticated route)
router.post("/create", verifyJWT, recipeController.createRecipe);

// Update a recipe with a new image (if provided)
router.patch("/", verifyJWT, recipeController.updateRecipe);

// Delete a recipe (Authenticated route)
router.delete("/", verifyJWT, recipeController.deleteRecipe);

// Get all recipes for a user (Authenticated route)
router.get("/", verifyJWT, recipeController.getAllRecipes);

// Get a recipe from a URL (Authenticated route)
router.get("/url", verifyJWT, recipeController.getUrlRecipe);

// Get one recipe by ID (Authenticated route)
router.get("/:id", verifyJWT, recipeController.getOneRecipe);

module.exports = router;
