const userModel = require('../schemas/User');

const create = function (data) {};

const findUserByUsername = async function (username) {
  const user = await userModel.findOne({ username });
  return user;
};

const createNewUser = async function ({ username, password }) {
  try {
    const user = await new userModel({
      username,
      password,
    });
    await user.save();
  } catch (error) {
    throw error;
  }
};

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  findUserByUsername,
  createNewUser,
  isAuthenticated,
};
