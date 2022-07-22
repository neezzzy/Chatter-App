const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;
const moment = require("moment");

server.listen(port, () => {
  console.log(`running on ${port}`);
});

app.use(require("express").static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// io.on from server side listens all incoming events.   Socket.emit
io.on("connection", (socket) => {
  //socket.on listens "sendMessage" from client and io.emit sends
  socket.on("sendMessage", (message) => {
    io.emit(
      "receiveMessage",
      chatMessage(message.from, message.text, socket.id)
    );
  });
});

const chatMessage = (from, text, socket) => {
  return {
    from,
    text,
    time: moment(new Date().getTime()).format("h:mm:ss a"),
    senderid: socket,
  };
};
