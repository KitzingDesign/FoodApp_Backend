const admin = require("../config/firebase");
const User = require("../models/User");

const verifyFirebaseToken = async (req, res, next) => {
  const token =
    req.body.firebaseToken || req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Check if user exists in your database
    const user = await User.findOne({ where: { email: decodedToken.email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = user.user_id; // set the user_id from your DB
    req.role = user.role; // set the user role
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
