// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/upload");

// Create a new recipe with an image (Authenticated route)
router.post(
  "/create",

  upload.single("image"),
  recipeController.createRecipe
);

router.use(verifyJWT);

// Update a recipe with a new image (if provided)
router.patch("/", recipeController.updateRecipe);

// Delete a recipe (Authenticated route)
router.delete("/", recipeController.deleteRecipe);

// Get all recipes for a user (Authenticated route)
router.get("/", recipeController.getAllRecipes);

// Get a recipe from a URL (Authenticated route)
router.get("/url", recipeController.getUrlRecipe);

// Get one recipe by ID (Authenticated route)
router.get("/:id", recipeController.getOneRecipe);

module.exports = router;
