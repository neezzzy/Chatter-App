import express from 'express';
import logger from 'morgan';
import './config/mongo.js';
// routes
import indexRouter from './routes/index.js';
import loginrouter from './routes/login.js';
import registerRouter from './routes/registerRouter.js';
import chatRouter from './routes/chatRouter.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import passportConfig from './config/passport.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || '3000';

app.set('port', port);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = createServer(app);
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.CONNECTION_URL,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// routes
app.use('/', indexRouter);
app.use('/login', loginrouter);
app.use('/register', registerRouter);
app.use('/chat', chatRouter);
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint doesn't exist`,
  });
});

const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', async function (socket) {
  console.log('connecting');
  // io.socketsJoin(room);
  // onlineUsers.push({
  //   socketId: socket.id,
  //   userId: currentUserId,
  // });
  console.log(socket.id);
  // console.log(currentUserId);
  const currentUsers = [];
  // io.sockets.in(room).emit('new user joined', currentUsers);
  app.set('io', io);
  
  socket.on('disconnect', () => {
    console.log('disconnect');
    // onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
  });
});

server.listen(port);
server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
