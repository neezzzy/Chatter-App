const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
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
