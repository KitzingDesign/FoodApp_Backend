const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Recipe = sequelize.define(
  "Recipe",
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "recipe_id",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      field: "user_id",
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "collections",
        key: "collection_id",
      },
      onDelete: "SET NULL",
      field: "collection_id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_url",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    timestamps: false, // We manage created_at manually
    tableName: "recipes", // Ensure the table name matches your existing table
    createdAt: "created_at", // Sequelize column name for created at
    updatedAt: false, // No updatedAt column in your table
  }
);

module.exports = Recipe;
