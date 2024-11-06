// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

const verifyJWT = require("../middleware/verifyJWT");
const uploadRecipeImg = require("../middleware/uploadRecipeImg");

// Making the route private
router.use(verifyJWT);

// @route post /recipes/create
// @desc create a new recipe
// @access Private
router.post(
  "/create",
  uploadRecipeImg.single("image"),
  recipeController.createRecipe
);

// @route PATCH /recipes
// @desc Update an existing recipe
// @access Private
router.patch(
  "/",
  uploadRecipeImg.single("image"),
  recipeController.updateRecipe
);

// @route delete /recipes
// @desc Delete an existing recipe
// @access Private
router.delete("/", recipeController.deleteRecipe);

// @route get /recipes
// @desc get all recipes
// @access Private
router.get("/", recipeController.getAllRecipes);

// @route get /recipes/url
// @desc extract a recipe from an url
// @access Private
router.get("/url", recipeController.getUrlRecipe);

// @route get /recipes/:id
// @desc get one recipe from its id
// @access Private
router.get("/:id", recipeController.getOneRecipe);

module.exports = router;
