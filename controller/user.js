import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import { fetchRandomAvatar } from '../utils/fetchRandomAvatar.js';

export default {
  onGetUserById: async (userId) => {
    try {
      const user = await UserModel.getUserById(userId);
      return user;
    } catch (error) {
      return console.log(error.message);
    }
  },

  onGetUsersById: async (ids) => {
    try {
      const users = await UserModel.getUsersByIds(ids);
      return users;
    } catch (error) {
      return console.log(error.message);
    }
  },

  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUsers();
      return users;
    } catch (error) {
      return console.log(error.message);
    }
  },

  onUserRegister: async function (req, res) {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const avatar = fetchRandomAvatar();
      await UserModel.createUser(username, hashedPassword, avatar);
      res.redirect('/login');
    } catch (error) {
      console.log(error.message);
      return console.log(error.message);
    }
  },

  onUserLogin: async (req, res, next) => {
    const { username, password, roomName } = req.body;
    const user = await UserModel.getUserByUsername(username);

    if (user == null) {
      return console.log('Cannot find user');
    }
    try {
      if (await bcrypt.compare(password, user[0].password)) {
        req.userId = user[0].id;
        req.roomName = roomName;
        req.session.userId = user[0].id;
        next();
      } else {
        res.redirect('/');
      }
    } catch (error) {
      res.redirect('/');
    }
  },
};
