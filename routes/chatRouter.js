import express from 'express';
import user from '../controller/user.js';
import { isLoggedIn } from '../utils/isLoggedIn.js';

const router = express.Router();
let onlineUsers = [];

router.post('/', isLoggedIn, (req, res, next) => {
  const io = req.app.get('socketio');
  const room = req.body.roomName;
  const currentUserId = req.session.userId;
  io.on('connection', async function (socket) {
    console.log(`${socket.id} connected`);
    socket.join(room);

    io.sockets.in(room).emit('message', 'what is going on, party people?');

    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  });

  res.render('pages/chat.ejs');
});

export default router;
