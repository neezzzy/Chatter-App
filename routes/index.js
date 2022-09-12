import express from 'express';
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', isLoggedIn, (req, res) => {
  res.render('pages/chat.ejs');
});



export default router;
