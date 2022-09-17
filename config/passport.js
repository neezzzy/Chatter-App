const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../schemas/User.js');

const passportConfig = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username' });

        user.validatePassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, user);
        });
      });
    })
  );
};

module.exports = passportConfig;
