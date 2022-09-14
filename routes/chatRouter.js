import express from 'express';
import user from '../controller/user.js';
import { isLoggedIn } from '../utils/isLoggedIn.js';

const router = express.Router();
let onlineUsers = [];

router.post('/', isLoggedIn, (req, res, next) => {
  const io = req.app.get('socketio');
  const room = req.body.roomName;
  const currentUserId = req.session.passport.user;

  io.on('connection', async function (socket) {
    socket.join(room);

    // io.sockets.in(room).emit('message', 'what is going on, party people?');

    const userDoc = await user.onGetUserById(currentUserId)

    onlineUsers.push({
      socket: socket.id,
      userId: userDoc,
    });

    console.log(onlineUsers)

    socket.on('new user joined', () => {});

    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  });

  res.render('pages/chat.ejs');
});

export default router;
