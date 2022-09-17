require('dotenv').config();
const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fetchRandomAvatar = require('../utils/fetchRandomAvatar.js');

const SALT = 10;
const DEFAULT_USER_PICTURE = fetchRandomAvatar();

const UserSchema = new Mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, default: null },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function (next) {
  const user = this;

  // ensure user picture is set
  if (!user.avatar) {
    user.avatar = DEFAULT_USER_PICTURE;
  }

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // hash the password using our new salt
  bcrypt.hash(user.password, SALT, function (err, hash) {
    if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UserSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;
