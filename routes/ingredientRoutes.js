const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
const verifyJWT = require("../middleware/verifyJWT");

// Making the route private
router.use(verifyJWT);

// @route GET /ingredients
// @desc Get all ingredients for a specific recipe
// @access Private
router.get("/:id", ingredientController.getAllIngredients);

// @route POST /ingredients
// @desc Create a new ingredient for a recipe
// @access Private
router.post("/", ingredientController.createIngredient);

// @route PATCH /ingredients
// @desc Update an existing ingredient
// @access Private
router.patch("/", ingredientController.updateIngredient);

// @route DELETE /ingredients
// @desc Delete an ingredient
// @access Private
router.delete("/", ingredientController.deleteIngredient);

module.exports = router;
