import express from 'express';
const router = express.Router();
import {isLoggedIn} from '../utils/isLoggedIn.js';


router.get('/', isLoggedIn, (req, res) => {
  res.render('pages/roomchat.ejs', { username: req.user.username});
});



export default router;
