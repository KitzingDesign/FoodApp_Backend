const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    { expiresIn: "15m" }
  );
};

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the user by email
    const foundUser = await User.findOne({ where: { email: email } });
    if (!foundUser) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: 7 days
    });

    // Return Access Token
    res.json({ accessToken });
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
    res.json({ accessToken });
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
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Logged out successfully" });
};

// @desc Delete a user
// @route DELETE /auth/:userId
// @access Private (you should implement authentication middleware to protect this route)
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete the user
    await User.destroy({ where: { user_id: userId } });
    res.status(204).send(); // No Content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  refresh,
  logout,
  deleteUser,
};
