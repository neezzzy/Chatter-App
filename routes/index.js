const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');
const Room = require('../models/room');
// Home page
router.get('/', function (req, res, next) {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms');
  } else {
    res.render('login', {
      errors: req.flash('error'),
    });
  }
});

// Login
router.get('/login', function (req, res, next) {
  res.render('login', {
    errors: req.flash('error'),
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/rooms',
    failureRedirect: '/',
    failureFlash: true,
  })
);

// Register via username and password
router.get('/register', (req, res) => {
  res.render('register', {
    errors: req.flash('error'),
  });
});

router.post('/register', async function (req, res, next) {
  const credentials = { username: req.body.username, password: req.body.password };
  if (credentials.username === '' || credentials.password === '') {
    req.flash('error', 'Username and/or Password cannot be empty');
    res.redirect('/register');
  } else {
    // Check if the username already exists for non-social account
    const user = await User.findUserByUsername(credentials.username);

    if (user) {
      req.flash('error', 'Username already exists.');
    } else {
      await User.createNewUser(credentials);
      res.redirect('/login');
    }
  }
});

// Rooms
router.get('/rooms', [
  User.isAuthenticated,
  function (req, res, next) {
    Room.find(function (err, rooms) {
      if (err) throw err;
      res.render('rooms', { rooms });
    });
  },
]);

// Chat Room
router.get('/chat/:id', [
  User.isAuthenticated,
  function (req, res, next) {
    const roomId = req.params.id.trim();
    Room.findById(roomId, function (err, room) {
      if (err) throw err;
      if (!room) {
        return next();
      }
      res.render('chatroom', { user: req.user, room: room });
    });
  },
]);

// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    req.session = null;
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
