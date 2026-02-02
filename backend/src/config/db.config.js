const admin = require("firebase-admin");
const serviceAccount = require("../../smart-carrer-firebase-adminsdk-fbsvc-526cbb0ba7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = db;

