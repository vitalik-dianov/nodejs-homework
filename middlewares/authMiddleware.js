const { authenticate } = require('../models/users');
const { createError } = require('../helpers/errors');

const authMiddleware = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !token) {
    next(createError(401, 'Not authorized'));
  }

  const user = await authenticate(token);

  if (!user) {
    next(createError(401, 'Not authorized'));
  }
  req.user = user;
  next();
};

module.exports = { authMiddleware };
