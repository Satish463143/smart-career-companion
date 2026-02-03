const admin = require("firebase-admin");
const serviceAccount = require("../../smart-carrer-firebase-adminsdk-fbsvc-526cbb0ba7.json"); // adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔴 PUT THE ADMIN USER UID HERE (from Firebase Auth)
const ADMIN_UID = "cTqGBbl6VCTjou76y6Nwd57xIlv1";

async function makeAdmin() {
  try {
    await admin.auth().setCustomUserClaims(ADMIN_UID, {
      role: "admin",
    });

    console.log("✅ Admin role assigned successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to assign admin role:", error);
    process.exit(1);
  }
}

makeAdmin();
