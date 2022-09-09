import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ''),
    },
    userIds: Array,
    roomName: String,
  },
  {
    timestamps: true,
    collection: 'chatrooms',
  }
);

chatRoomSchema.statics.createNewRoom = async function (userIds, roomName) {
  try {
    await this.create({ userIds, roomName });
  } catch (error) {
    console.log('error on start chat method', error.message);
  }
};

// only add user id if it is not already there
chatRoomSchema.statics.addNewUserToRoom = async function (userId) {
  try {
    this.where({ userIds: { $not: { $all: userId } } }),
      function async() {
        this.updateOne({ $push: { userIds: userId } });
      };
  } catch (error) {
    console.log('error on start chat method', error.message);
  }
};

chatRoomSchema.statics.findRoomByName = async function (roomName) {
  try {
    return await this.findOne({ roomName: roomName });
  } catch (error) {
    console.log('error on start chat method', error.message);
  }
};

export default mongoose.model('ChatRoom', chatRoomSchema);
