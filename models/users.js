require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/usersModel');
const { createError } = require('../helpers/errors');

const register = async (email, password) => {
  try {
    const data = await User.findOne({ email });

    if (data) {
      throw createError(409, 'Email in use');
    }

    const user = User.create({
      email,
      password: await bcrypt.hash(password, 10),
    });

    return user;
  } catch (error) {
    return error;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    console.log(user);
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

    const payload = {
      id: user._id,
      email,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, process.env.JWT_SALT);
    await User.findByIdAndUpdate(user._id, { token });

    return await authenticate(token);
  } catch (error) {
    // console.log(error);
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

module.exports = {
  register,
  login,
  authenticate,
  logout,
};
