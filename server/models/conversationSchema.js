const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  participants: [String],
  created_at: Date,
});

module.exports = conversationSchema;