import express from 'express';
import user from '../controller/user.js';

const router = express.Router();
let onlineUsers = [];

router.get('/', (req, res, next) => {
  res.render('pages/chat.ejs');
});

router.get(
  '/:roomName',
  (req, res, next) => {
    const io = req.io;
    const room = req.params.roomName;
    const currentUserId = req.session.userId;

    io.on('connection', async function (socket) {
      console.log('connecting');
      socket.join(room);

      function userExists(socketId) {
        return onlineUsers.some(function (el) {
          return el.socketId === socketId;
        });
      }
      if (!userExists(socket.id)) {
        onlineUsers.push({
          socketId: socket.id,
          userId: currentUserId,
        });
      }

      const currentUser = await user.onGetUserById(currentUserId);
      io.sockets.in(room).emit('new user joined', currentUser);

      socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      });
    });
    next();
  }
);

export default router;
