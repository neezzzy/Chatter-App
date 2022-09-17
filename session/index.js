require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require('../config/mongo');
/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
const init = function () {
  return session({
    secret: 'foo',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTION_URL }),
  });
};

module.exports = init();
