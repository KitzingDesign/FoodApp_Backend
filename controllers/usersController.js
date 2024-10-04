const { sequelize } = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getUser = async (req, res) => {
  const { userId } = req.params;

  // Validate the user_id
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    // Fetch the user with the given user_id
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: { exclude: ["password"] },
      raw: true,
    });

    // If no user found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user data
    res.json(user);
  } catch (err) {
    // Handle any errors that occurred during the query
    res.status(500).json({ message: err.message });
  }
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

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { first_name, last_name, profile_picture } = req.body;
  let { user_id } = req.body;
  const userId = Number(user_id);
  console.log("Requested file", req.file);

  console.log("Update user:", req.body);

  let imageUrl = profile_picture || "";
  // If an image was uploaded, use the Cloudinary URL
  if (req.file) {
    imageUrl = req.file.path; // This is the Cloudinary URL from multer
  }

  try {
    // Find user by primary key
    const user = await User.findByPk(Number(userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;

    user.profile_picture = imageUrl;

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: `'${updatedUser.first_name}' updated`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUser,
  createNewUser,
  updateUser,
};
