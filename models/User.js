import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ''),
    },
    username: String,
    password: String,
    avatar: String,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);
/**
 * @param {String} firstName
 * @param {String} lastName
 * @returns {Object} new user object created
 */
userSchema.statics.createUser = async function (username, hashedPassword, avatar) {
  try {
    const user = await this.create({ username, password: hashedPassword, avatar });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw { error: 'No user with this id found' };
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByUsername = async function (username) {
  try {
    const user = await this.find({ username });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find({});
    return users;
  } catch (error) {
    throw error;
  }
};

/**
 * @param {String} id - id of user
 * @return {Object} - details of action performed
 */
userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};
export default mongoose.model('User', userSchema);
