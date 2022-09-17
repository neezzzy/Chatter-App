const Mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
const RoomSchema = new Mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ''),
  },
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }] },
});

const roomModel = Mongoose.model('room', RoomSchema);

module.exports = roomModel;
