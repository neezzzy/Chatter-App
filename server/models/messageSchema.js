const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderID: String,
  content: String,
  createdAt: String,
});

module.exports = messageSchema;
