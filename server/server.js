const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname + "/../client"));

http.listen(3000);

const users = {};

io.on("connection", (socket) => {
  socket.on("user connected", (payload) => {
    users[socket.id] = {
      id: socket.id,
      name: payload.name,
      avatar: payload.avatar,
    };

    socket.broadcast.emit("user connected", users[socket.id]);
  });

  socket.on("send message", (payload) => {
    
    socket.broadcast.emit("send message", {
      user: payload.user,
      message: payload.message,
    });
  });
});
