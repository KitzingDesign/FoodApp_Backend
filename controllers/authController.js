const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Everything in lower case
  const emailLC = email.toLowerCase();

  try {
    // Find the user by email
    const foundUser = await User.findOne({ where: { email: emailLC } });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const accessToken = jwt.sign(
      { email: foundUser.email, user_id: foundUser.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Saving refresh token with current user
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleLogin };
