const { sequelize } = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from mySQL
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { first_name, last_name, password, email } = req.body;

  // Confirm data
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for duplicate email
    const duplicate = await User.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")), // Convert email column to lowercase
        email.toLowerCase() // Compare with lowercase email
      ),
      raw: true,
    });

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate email" });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 12); // salt rounds

    // Create the userObject without handling roles
    const userObject = { email, first_name, last_name, password: hashedPwd };

    // Create and store the new user in the database
    const user = await User.create(userObject);
    console.log("User created successfully:", user);

    // Respond with success
    res.status(201).json({ message: `New user ${user.email} created` });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
};
