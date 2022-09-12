import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("pages/login.ejs");
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);
export default router;