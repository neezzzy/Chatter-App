// models
import ChatRoomModel from '../models/ChatRoom.js';

export default {
  initiate: async (req, res) => {
    try {
      const userId = req.userId;
      const { roomName } = req.body;
      const room = await ChatRoomModel.findRoomByName(roomName);

      if (room == null) {
        const userIds = [];
        userIds.push(userId);
        await ChatRoomModel.createNewRoom(userIds, roomName);
      }
      if (room) {
        await ChatRoomModel.addNewUserToRoom(userId, room);
      }
      
      return res.redirect(`/chat/${roomName}`);
      
    } catch (error) {
      console.log(error.message);
    }
  },
};
