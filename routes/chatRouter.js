import express from 'express';
import user from '../controller/user.js';

const router = express.Router();
let onlineUsers = [];

router.get('/:roomName', (req, res) => {
  const io = req.app.get('socketio');
  const room = req.params.roomName;
  const currentUserId = req.session.userId;



  res.render('pages/chat.ejs');
});

export default router;
