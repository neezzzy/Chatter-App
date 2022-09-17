const roomModel = require('../schemas/Room');
const User = require('../schemas/User');

const create = function (data, callback) {
  const newRoom = new roomModel(data);
  newRoom.save(callback);
};

const find = function (data, callback) {
  roomModel.find(data, callback);
};

const findOne = function (data, callback) {
  roomModel.findOne(data, callback);
};

const findById = function (id, callback) {
  roomModel.findById(id, callback);
};

const findByIdAndUpdate = function (id, data, callback) {
  roomModel.findByIdAndUpdate(id, data, { new: true }, callback);
};

/**
 * Add a user along with the corresponding socket to the passed room
 *
 */
const addUser = function (room, socket, callback) {
  // Get current user's id
  const userId = socket.request.session.passport.user;

  // Push a new connection object(i.e. {userId + socketId})
  const conn = { userId: userId, socketId: socket.id };
  room.connections.push(conn);
  room.save(callback);
};

/**
 * Get all users in a room
 *
 */
const getUsers = function (room, socket, callback) {
  let users = [],
    vis = {},
    count = 0;
  const userId = socket.request.session.passport.user;

  // Loop on room's connections, Then:
  room.connections.forEach(function (conn) {
    // 1. Count the number of connections of the current user(using one or more sockets) to the passed room.
    if (conn.userId === userId) {
      count++;
    }

    // 2. Create an array(i.e. users) contains unique users' ids
    if (!vis[conn.userId]) {
      users.push(conn.userId);
    }
    vis[conn.userId] = true;
  });

  // Loop on each user id, Then:
  // Get the user object by id, and assign it to users array.
  // So, users array will hold users' objects instead of ids.
  let loadedUsers = 0;
  users.forEach(function (userId, i) {
    User.findById(userId, function (err, user) {
      if (err) {
        return callback(err);
      }
      users[i] = user;

      // fire callback when all users are loaded (async) from database
      if (++loadedUsers === users.length) {
        return callback(null, users, count);
      }
    });
  });
};

/**
 * Remove a user along with the corresponding socket from a room
 *
 */
const removeUser = function (socket, callback) {
  // Get current user's id
  const userId = socket.request.session.passport.user;

  find(function (err, rooms) {
    if (err) {
      return callback(err);
    }

    // Loop on each room, Then:
    rooms.every(function (room) {
      let pass = true,
        count = 0,
        target = 0;

      // For every room,
      // 1. Count the number of connections of the current user(using one or more sockets).
      room.connections.forEach(function (conn, i) {
        if (conn.userId === userId) {
          count++;
        }
        if (conn.socketId === socket.id) {
          (pass = false), (target = i);
        }
      });

      // 2. Check if the current room has the disconnected socket,
      // If so, then, remove the current connection object, and terminate the loop.
      if (!pass) {
        room.connections.id(room.connections[target]._id).remove();
        room.save(function (err) {
          callback(err, room, userId, count);
        });
      }

      return pass;
    });
  });
};

module.exports = {
  create,
  find,
  findOne,
  findById,
  addUser,
  getUsers,
  removeUser,
};
