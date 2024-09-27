const Collection = require("../models/Collection"); // Assuming you've created the Collection model
const Recipe = require("../models/Recipe"); // For fetching recipes in a collection
const User = require("../models/User"); // Assuming you have a User model to manage users

// @desc Create a new collection
// @route POST /collections
// @access Private
exports.createCollection = async (req, res) => {
  const { user_id, name, description } = req.body;

  // Validate request
  if (!user_id || !name) {
    return res
      .status(400)
      .json({ message: "User ID and Collection name are required." });
  }

  try {
    // Create the new collection
    const newCollection = await Collection.create({
      user_id,
      name,
      description,
    });

    res.status(201).json({
      message: `New collection '${newCollection.name}' created`,
      collection: newCollection,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all collections for a user
// @route GET /collections
// @access Private
exports.getCollections = async (req, res) => {
  const { user_id } = req.query; // User ID from the query params

  // Validate request
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Fetch all collections for the given user
    const collections = await Collection.findAll({
      where: { user_id },
    });

    // Convert the result to plain JSON
    const plainCollections = collections.map((collection) =>
      collection.get({ plain: true })
    );

    console.log(plainCollections);

    res.json(plainCollections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get one recipe by ID and user ID
exports.getOneCollection = async (req, res) => {
  const { id } = req.params; // Get recipe ID from the URL

  // Validate input
  if (!id) {
    return res
      .status(400)
      .json({ message: "Recipe ID and User ID are required." });
  }

  try {
    const collection = await Collection.findOne({
      where: {
        collection_id: id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    // Convert to plain JSON if using Sequelize
    res.status(200).json(collection.get({ plain: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update a collection
// @route PATCH /collections/:id
// @access Private
exports.updateCollection = async (req, res) => {
  const { name, description, id } = req.body;

  // Validate request
  if (!name) {
    return res.status(400).json({ message: "Collection name is required." });
  }

  try {
    // Find the collection by its ID
    const collection = await Collection.findByPk(id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    // Update the collection
    collection.name = name;
    collection.description = description || collection.description;

    await collection.save();

    res.status(200).json({
      message: `Collection '${collection.name}' updated`,
      collection,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a collection
// @route DELETE /collections/:id
// @access Private
exports.deleteCollection = async (req, res) => {
  const { collection_id } = req.query; // Maybe change to req body

  try {
    // Find the collection by its ID
    const collection = await Collection.findByPk(collection_id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    // Delete the collection (this will not delete associated recipes unless cascading is set)
    await collection.destroy();

    res
      .status(200)
      .json({ message: `Collection '${collection.name}' deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all recipes in a specific collection
// @route GET /collections/:id/recipes
// @access Private
exports.getCollectionRecipes = async (req, res) => {
  const { id } = req.params; // Collection ID from the URL params

  try {
    // Fetch the collection along with its associated recipes
    const collection = await Collection.findByPk(id, {
      include: {
        model: Recipe,
        as: "recipes", // Assuming you set up the relation as 'recipes' in associations
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    res.status(200).json(collection.recipes); // Return recipes in the collection
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
