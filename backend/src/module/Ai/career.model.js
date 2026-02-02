const db = require("../../config/db.config");

const CareerModel = {
  save: async (userId, data) => {
    try {
      const docRef = db.collection("users").doc(userId).collection("career_recommendations").doc();
      const payload = {
        ...data,
        createdAt: new Date(),
        id: docRef.id
      };
      await docRef.set(payload);
      return payload;
    } catch (error) {
      console.error("Error saving career recommendation:", error);
      throw error;
    }
  }
};

module.exports = CareerModel;