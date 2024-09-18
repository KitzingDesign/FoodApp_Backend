const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find the user by email
  const foundUser = await User.findOne({ where: { email: email } });

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Compare password
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Create Access Token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        user_id: foundUser.user_id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Create Refresh Token
  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Set for 7 days
  );

  // // Save refresh token in the database
  // foundUser.refreshToken = refreshToken;
  // await foundUser.save();

  // Set Secure Cookie with Refresh Token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV === "production", // https
    sameSite: "Lax", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: 7 days
  });

  // Return Access Token
  res.json({ accessToken });
};

// @desc Refresh Token
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  // // Clear old refresh token
  // res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  // // Find user with the refresh token
  // const foundUser = await User.findOne({
  //   where: { refreshToken: refreshToken },
  // });

  // Verify refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Find user by email
      const foundUser = await User.findOne({ where: { email: decoded.email } });

      // Token is valid, create new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            user_id: foundUser.user_id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Return new access token
      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  // Clear the cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
