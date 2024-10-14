const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err); // Log the error for debugging
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach user information to the request object
    req.email = decoded.UserInfo.email;
    req.user_id = decoded.UserInfo.user_id;

    // Call next middleware or route handler
    next();
  });
};

module.exports = verifyJWT;
