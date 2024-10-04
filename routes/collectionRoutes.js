const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");

// Routes for managing collections

// @route POST /collection
// @desc Create a new collection
// const { user_id, name, description } = req.body;
router.post("/", collectionController.createCollection);

// @route GET /collection
// @desc Get all collections for a user (using query parameter user_id)
router.get("/", collectionController.getCollections);

// @route GET /collection/{id}
// @desc Get one collections for a user (using query parameter user_id)
router.get("/one/:id", collectionController.getOneCollection);

// @route PATCH /collection/
// @desc Update a collection by ID
router.patch("/", collectionController.updateCollection); // params or not?

// @route DELETE /collection/
// @desc Delete a collection by ID
router.delete("/:id", collectionController.deleteCollection); // params or not?

// @route GET /collection/:id/recipes
// @desc Get all recipes in a specific collection by collection ID
router.get("/:id/recipes", collectionController.getCollectionRecipes);

module.exports = router;
