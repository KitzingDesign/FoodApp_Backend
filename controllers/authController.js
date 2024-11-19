const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const cloudinary = require("../config/cloudinaryConfig");

const extractPublicImgId = require("../middleware/extractPublicImgId");

// Helper function to create tokens
const createToken = (user) => {
  return jwt.sign(
    {
      UserInfo: {
        email: user.email,
        user_id: user.user_id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15min" }
  );
};

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ message: "Firebase token is required" });
  }

  try {
    // // Find the user by email
    // const foundUser = await User.findOne({ where: { email: email } });
    // if (!foundUser) {
    //   return res.status(401).json({ message: "Wrong username or password" });
    // }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    // Check if user exists in your database
    let foundUser = await User.findOne({ where: { uid: decodedToken.uid } });

    // Create Access Token
    const accessToken = createToken(foundUser);

    // Create Refresh Token
    const refreshToken = jwt.sign(
      { email: foundUser.email },
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

    // Return Access Token
    res.json({
      accessToken,
      user: { email: foundUser.email, user_id: foundUser.user_id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const googleLogin = async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ message: "Firebase token is required" });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, picture, name } = decodedToken; // Extract uid and email from decoded token

    // Check if the user exists in your database
    let foundUser = await User.findOne({ where: { uid } });

    // If the user does not exist, create a new user
    if (!foundUser) {
      foundUser = await User.create({
        uid, // Store the Firebase uid
        email, // Use email from the decoded token
        // You can store other user details as needed, e.g., displayName, etc.
        profile_picture: picture || null,
        first_name: name.split(" ")[0] || null,
        last_name: name.split(" ")[1] || null,
      });
    }

    // Create JWT Access Token
    const accessToken = createToken(foundUser);

    // Create JWT Refresh Token
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Refresh token lasts for 7 days
    );

    // Set Secure Cookie with Refresh Token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production

      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cookie is sent only on same-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set cookie to expire in 7 days
    });

    // Return Access Token and user details to client
    res.json({
      accessToken,
      user: {
        email: foundUser.email,
        user_id: foundUser.user_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc Refresh Token
// @route GET /auth/refresh
// @access Public
const refresh = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user by email
    const foundUser = await User.findOne({ where: { email: decoded.email } });
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    // Create new Access Token
    const accessToken = createToken(foundUser);

    // Return new Access Token
    res.json({
      token: accessToken,
      user_id: foundUser.user_id,
      email: foundUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Forbidden" });
  }
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204); // No content

  // Clear the cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: true,
  }); //change to secure: true in production
  res.json({ message: "Logged out successfully" });
};

// @desc Delete a user
// @route DELETE /auth/:userId
// @access Private (you should implement authentication middleware to protect this route)
// @desc Delete a user
// @route DELETE /auth/:userId
// @access Private (you should implement authentication middleware to protect this route)
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the image URL (if the user has one)
    const imageUrl = user.image_url;

    // Attempt to delete the user's folder from Cloudinary (recipes/user_id)
    try {
      await cloudinary.api.delete_resources_by_prefix(
        `users/${userId}/`,
        function (result) {
          console.log(result);
        }
      );
      await cloudinary.api.delete_folder(`users/${userId}`); // Delete the folder after the images are gone
    } catch (cloudinaryError) {
      console.log(
        `Cloudinary folder deletion failed: ${cloudinaryError.message}`
      );
      // Continue without failing if the folder doesn't exist
    }

    // Attempt to delete the user's folder from Cloudinary (recipes/user_id)
    try {
      await cloudinary.api.delete_resources_by_prefix(
        `recipes/${userId}/`,
        function (result) {
          console.log(result);
        }
      );
      await cloudinary.api.delete_folder(`recipes/${userId}`); // Delete the folder after the images are gone
    } catch (cloudinaryError) {
      console.log(
        `Cloudinary folder deletion failed: ${cloudinaryError.message}`
      );
      // Continue without failing if the folder doesn't exist
    }

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(user.uid); // Delete from Firebase using their UID

    // Finally, delete the user from your database
    await User.destroy({ where: { user_id: userId } });

    // Send a response indicating successful deletion
    res.status(204).send(); // No Content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  googleLogin,
  refresh,
  logout,
  deleteUser,
};
