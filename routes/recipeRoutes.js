// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const verifyJWT = require("../middleware/verifyJWT");

// Create a new recipe (Authenticated route)
router.post("/create", verifyJWT, recipeController.createRecipe);

// Get all recipes for a specific user
router.get("/user/:userId", recipeController.getRecipesByUser);

// Get a specific recipe
router.get("/:id", recipeController.getRecipeById);

module.exports = router;
