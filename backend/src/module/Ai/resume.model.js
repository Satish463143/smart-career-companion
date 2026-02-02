const db = require("../../config/db.config");

const ResumeModel = {
  save: async (userId, resumeContent, pdfBuffer) => {
    try {
      const docRef = db.collection("users").doc(userId).collection("resumes").doc();
      const base64Pdf = pdfBuffer.toString('base64');
      
      const payload = {
        userId,
        content: resumeContent,
        pdfBase64: base64Pdf,
        createdAt: new Date(),
        id: docRef.id,
        fileName: `Resume_${userId}_${Date.now()}.pdf`
      };
      
      await docRef.set(payload);
      return payload;
    } catch (error) {
      console.error("Error saving resume:", error);
      throw error;
    }
  }
};

module.exports = ResumeModel;