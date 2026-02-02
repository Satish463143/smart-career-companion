const db = require("../../config/db.config");

const ChatModel = {
  save: async (chatData) => {
    try {
      const chatRef = db.collection("chats").doc();
      const payload = {
        ...chatData,
        createdAt: new Date(),
        id: chatRef.id
      };
      await chatRef.set(payload);
      return payload;
    } catch (error) {
      console.error("Error saving chat:", error);
      throw error;
    }
  }
};

module.exports = ChatModel;
