require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/usersModel');
const { createError } = require('../helpers/errors');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const uuid = require('uuid');
const  sendEmail  = require('./email');

const register = async (email, password) => {
  try {
    const data = await User.findOne({ email });

    if (data) {
      throw createError(409, 'Email in use');
    }

    const url = gravatar.url(
      email,
      { d: 'robohash', s: '250' },
      false
    );
    const verifyToken = uuid.v4();

    const user = User.create({
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL: url,
      verifyToken,
    });

    await sendEmail(email, verifyToken);

    return user;
  } catch (error) {
    return error;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Email or password is wrong!');
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw createError(401, 'Email or password is wrong!');
    }
    if (!user.verify) {
      throw createError(401, 'User not verified');
    }

    const payload = {
      id: user._id,
      email,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, process.env.JWT_SALT);
    await User.findByIdAndUpdate(user._id, { token });

    return await authenticate(token);
  } catch (error) {
    return error;
  }
};

const authenticate = async token => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SALT);
    const user = await User.findById(id);

    return user.token === token ? user : null;
  } catch (err) {
    return null;
  }
};

const logout = async id => {
  await User.findByIdAndUpdate(id, { token: null });
};

const uploadImage = async (filepath, filename, id) => {
  const newPath = path.resolve(`./public/avatars/${filename}`);
  const avatarURL = `/avatars/${filename}`;
  const image = await Jimp.read(filepath);
  try {
    await image.resize(250, 250);
    await image.writeAsync(newPath);
    await User.findByIdAndUpdate(id, { avatarURL });
    return avatarURL;
  } catch (error) {
    console.log(error.message);
  } finally {
    await fs.unlink(filepath);
  }
};

const verifyUser = async verifyToken => {
  const user = await User.findOne({ verifyToken });
  if (!user) {
    return false;
  }
  await User.findByIdAndUpdate(user._id, {
    verifyToken: null,
    verify: true,
  });
  return true;
};

const reVerifyUser = async email => {
  const user = await User.findOne({ email });
  if (user.verify) {
    throw createError(400, 'Verification has already been passed');
  }
  await sendEmail(email, user.verifyToken);
  return true;
};

module.exports = {
  register,
  login,
  authenticate,
  logout,
  uploadImage,
  verifyUser,
  reVerifyUser,
};
