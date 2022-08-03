const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  conversation_id: mongoose.Schema.Types.ObjectId,
  sender: String,
  content: String,
});

module.exports = messageSchema;
