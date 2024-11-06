const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const verifyJWT = require("../middleware/verifyJWT");

// Making the route private
router.use(verifyJWT);

// @route POST /collection
// @desc Create a new collection
// @access Private
router.post("/", collectionController.createCollection);

// @route GET /collection
// @desc Get all collections for a user
// @access Private
router.get("/", collectionController.getCollections);

// @route GET /collection/{id}
// @desc Get one collections for a user
// @access Private
router.get("/one/:id", collectionController.getOneCollection);

// @route GET /collection/one/{id}
// @desc Get one collections for a user
// @access Private
router.get("/one/:id", collectionController.getOneCollection);

// @route PATCH /collection/
// @desc Update a collection by ID
// @access Private
router.patch("/", collectionController.updateCollection);

// @route DELETE /collection/
// @desc Delete a collection by ID
// @access Private
router.delete("/:id", collectionController.deleteCollection);

// @route GET /collection/:id/recipes
// @desc Get all recipes in a specific collection by collection ID
// @access Private
router.get("/:id/recipes", collectionController.getCollectionRecipes);

module.exports = router;
