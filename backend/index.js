const app = require("./src/config/express.config");
require("dotenv").config();
const port = process.env.PORT || 9005;
const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

app.listen(port, () => {
  try{
    console.log(`Server is running on port ${port}`);
  }catch(excption){
    console.log(excption);
  }
});