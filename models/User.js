const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define the User model
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "user_id",
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "email",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password",
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
      field: "profile_picture", // Maps to the column name in the database
    },
    //Added to be able to include google login in the future
    google_id: {
      type: DataTypes.STRING(255),
      allowNull: true, // Assuming google_id is nullable
      field: "google_id", // Maps to the column name in the database
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Default value for created_at
      field: "created_at", // Maps to the column name in the database
    },
    role: {
      type: DataTypes.ENUM("user", "admin"), // Define ENUM type
      allowNull: false,
      defaultValue: "user", // Default value
      field: "role", // Maps to the column name in the database
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false, // We manage created_at manually
    tableName: "users", // Ensure the table name matches your existing table
    createdAt: "created_at", // Sequelize column name for created at
    updatedAt: false, // No updatedAt column in your table
  }
);

module.exports = User;
