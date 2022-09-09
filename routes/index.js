import express from 'express';
import user from '../controller/user.js';
import chatRoom from '../controller/chatRoom.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/login.ejs');
});

router.post('/', user.onUserLogin, chatRoom.initiate );

export default router;
