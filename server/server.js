const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userSchema = require("./models/userSchema");
const messageSchema = require("./models/messageSchema");
const path = require("path");
const moment = require("moment");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
http.listen(3000);

const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;
  return `url(${process.env.AVATAR_URL}${size}/${size})`;
};

async function connectDB() {
  const url = process.env.DB_URL;
  await mongoose.connect(url, { useNewUrlParser: true });
}

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

async function createUser(username, socket) {
  try {
    const newUser = new User({
      username: username,
      avatar: fetchRandomAvatar(),
      id: socket.id,
    });

    newUser.save(newUser);
  } catch (error) {
    console.log(error);
  }
}

async function createNewMessage(socket, message) {
  try {
    const newMessage = new Message({
      senderID: socket.id,
      content: message,
      createdAt: moment().format("h:mm a"),
    });

    newMessage.save(newMessage);
    return newMessage;
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllUsers() {
  return await User.find();
}

async function fetchAllMessages() {
  return await Message.find();
}

async function deleteUser(socketId) {
  await User.deleteOne({ id: socketId });
}

connectDB().catch((err) => console.log(err));

// run when clients connects
io.on("connection", async (socket) => {
  socket.on("typed username", async function ({ username }) {
    await createUser(username, socket);
    const users = await fetchAllUsers();
    // implement authentication here
    // if user already exists, find it and send it
    // if user doesn't exist, create it and send it

    io.emit("new user joined", { users });

    // client disconnects
    socket.on("disconnect", async function () {
      await deleteUser(socket.id);
      const updatedUsers = await fetchAllUsers();
      io.emit("user has left", updatedUsers);
    });

    socket.on("chatMessage", async function ({ message }) {
      const user = await User.find({ id: socket.id });
      const newMessage = await createNewMessage(socket, message);
      io.emit("message", { newMessage, user });
    });
  });
});

