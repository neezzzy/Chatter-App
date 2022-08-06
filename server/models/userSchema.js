const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = userSchema;
