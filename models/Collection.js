const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Recipe = require("./Recipe");

const Collection = sequelize.define(
  "Collection",
  {
    collection_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure that a collection is always associated with a user
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false, // The collection must have a name
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Description is optional
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, // Automatically set the current timestamp when a collection is created
    },
  },
  {
    tableName: "collections", // Explicitly defining table name
    timestamps: false, // Disable automatic timestamps since we're managing them manually
  }
);

// A Collection has many Recipes
Collection.hasMany(Recipe, {
  foreignKey: "collection_id",
  as: "recipes", // Alias for the associated Recipes
  onDelete: "SET NULL", // If the collection is deleted, set collection_id in recipes to NULL
});

module.exports = Collection;
