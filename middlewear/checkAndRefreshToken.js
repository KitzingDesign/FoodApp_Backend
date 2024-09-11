const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to check and refresh tokens
const checkAndRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).send("Access Denied");

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!foundUser) return res.sendStatus(403); // Forbidden

    // Verify the JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) {
          return res.sendStatus(403); // Forbidden
        }
        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
              user_id: decoded.user_id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" } // Adjust this in production
        );

        // Attach the new access token to the request object
        req.accessToken = accessToken;
        next();
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = checkAndRefreshToken;
