require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = require('../config/mongo');
/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
const init = function () {
  if (process.env.NODE_ENV === 'production') {
    return session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({ mongooseConnection: db.Mongoose.connection }),
    });
  } else {
    return session({
      secret: process.env.SECRET,
      resave: false,
      unset: 'destroy',
      saveUninitialized: true,
    });
  }
};

module.exports = init();
