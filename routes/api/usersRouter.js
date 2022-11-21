const Joi = require('joi');
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const express = require('express');
const { register, login, logout } = require('../../models/users');
const {
  authMiddleware,
} = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schema.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const data = await register(email, password);
  if (data.status) {
    return res.status(data.status).json({ message: data.message });
  }

  data
    ? res.status(201).json({ message: data })
    : res.status(400).json({ message: 'Bad request' });
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const data = await login(email, password);
  if (data?.status) {
    return res.status(data.status).json({ message: data.message });
  }
  res.status(200).json({ message: data });
});

router.post('/logout', authMiddleware, async (req, res, next) => {
  await logout(req.user._id);

  res.status(204).json({ message: 'No Content' });
});

router.get('/current', authMiddleware, async (req, res, next) => {
  const data = req.user;
  console.log(data);
  res.status(200).json({ message: data });
});
module.exports = router;
