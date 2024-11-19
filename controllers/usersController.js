const { sequelize } = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const admin = require("../config/firebase");

// Helper function to create tokens
const createToken = (user, expiresIn = "15m") => {
  return jwt.sign(
    {
      UserInfo: {
        email: user.email,
        user_id: user.user_id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  );
};

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

// normalizeName helper Function
const normalizeName = (name) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "N/A";

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { firebaseToken, first_name, last_name } = req.body;

  try {
    console.log("Verifying Firebase token...");
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const uid = decodedToken.uid;

    console.log("Decoded Token:", decodedToken);
    console.log("UID:", uid);

    try {
      console.log("Checking if user exists...");
      let user = await User.findOne({ where: { uid: uid } });
      if (user) return res.status(409).json({ message: "User already exists" });

      console.log("User found:", user);
    } catch (dbError) {
      console.error("Error querying the database:", dbError);
      res
        .status(500)
        .json({ message: "Database error", error: dbError.message });
    }

    // Create the user object without handling roles
    const userObject = {
      email: decodedToken.email,
      first_name: normalizeName(first_name),
      last_name: normalizeName(last_name),
      uid,
    };

    // Create and store the new user in the database
    const createdUser = await User.create(userObject);

    // Create Access Token
    const accessToken = createToken(createdUser);

    // Create Refresh Token
    const refreshToken = jwt.sign(
      { email: createdUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Set for 7 days
    );

    // Set Secure Cookie with Refresh Token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: 7 days
    });

    // Respond with success
    res.status(201).json({
      accessToken,
      user: { email: createdUser.email, user_id: createdUser.user_id },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    // Provide a more specific error message if needed
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Firebase token has expired" });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { first_name, last_name, profile_picture } = req.body;
  let { user_id } = req.body;
  const userId = Number(user_id);

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
