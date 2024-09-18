// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const verifyJWT = require("../middleware/verifyJWT");

// Create a new recipe (Authenticated route)
router.post("/create", verifyJWT, recipeController.createRecipe);
router.patch("/", recipeController.updateRecipe); // Route to update a recipe
router.delete("/", recipeController.deleteRecipe); // Route to delete a recipe

module.exports = router;
