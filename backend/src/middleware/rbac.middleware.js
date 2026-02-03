const admin = require("firebase-admin");

 const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = {verifyAdmin}
