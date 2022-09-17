require('dotenv').config();
require('./config/mongo');
// Chat application dependencies
const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');

// Chat application components
const cors = require('cors');
const passportConfig = require('./config/passport.js');
const passport = require('passport');
const logger = require('morgan');
const routes = require('./routes/index');
var session 	= require('./session/index');
// Set the port number
const port = process.env.PORT || '3000';
app.set('port', port);

const ioServer = require('./socket/index')(app);

app.use(express.static(path.join(__dirname, 'public')));
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(logger('dev'));
app.use(cors());
app.use(session);
// Passport.js
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// routes
app.use('/', routes);

ioServer.listen(port);
