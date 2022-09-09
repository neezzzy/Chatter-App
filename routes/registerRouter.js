import express from 'express';
import user from '../controller/user.js';

const router = express.Router();

router.get('/', (req, res) => {
  return res.render('pages/register.ejs');
});
router.post('/', user.onUserRegister);

export default router;
