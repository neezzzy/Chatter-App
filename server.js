import express from 'express';
import logger from 'morgan';
import './config/mongo.js';
import indexRouter from './routes/index.js';
import registerRouter from './routes/registerRouter.js';
import chatRouter from './routes/chatRouter.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || '3000';

app.set('port', port);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200,
};

const server = createServer(app);
const io = new Server(server);

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(cors(corsOptions));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/chat', chatRouter);
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint doesn't exist`,
  });
});

// app.set('socketio', io);

server.listen(port);
server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
