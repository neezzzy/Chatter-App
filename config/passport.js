import { Strategy as LocalStrategy} from 'passport-local'
import bcrypt from 'bcrypt';
import User from '../models/User.js';

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
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        bcrypt.compare(password, user.password, function (err, res) {
          if (err) return done(err);
          if (res === false) return done(null, false, { message: 'Incorrect password.' });

          return done(null, user);
        });
      });
    })
  );
};

export default passportConfig;
