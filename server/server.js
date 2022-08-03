const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userSchema = require("./models/userSchema");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
http.listen(3000);

const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;
  return `url(https://www.placecage.com/${size}/${size})`;
};

async function connectDB() {
  const url = "mongodb://localhost:27017/chatDB";
  await mongoose.connect(url, { useNewUrlParser: true });
}

const User = mongoose.model("User", userSchema);

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

async function fetchAllUsers() {
  return await User.find();
}

async function deleteUser(socketId) {
  await User.deleteOne({ id: socketId });
}

connectDB().catch((err) => console.log(err));

// run when clients connects
io.on("connection", async (socket) => {
  socket.on("typed username", async function ({ username }) {
    createUser(username, socket);
    const users = await fetchAllUsers();
    io.emit("new user joined", users);

    // client disconnects
    socket.on("disconnect", async function () {
      await deleteUser(socket.id);
      const users = await fetchAllUsers();
      io.emit("user has left", users);
    });
  });
});

// socket.broadcast (to all connected clients except sender)
// socket.emit (to single client)
// io.emit (to all clients in general)
