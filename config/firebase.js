const admin = require("firebase-admin");

// Double parse the JSON
const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Log the first parse result for debugging
try {
  const serviceAccount = JSON.parse(rawServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Error parsing JSON:", error);
}

module.exports = admin;
