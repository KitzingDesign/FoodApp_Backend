const admin = require("firebase-admin");

// Parse the Firebase service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
