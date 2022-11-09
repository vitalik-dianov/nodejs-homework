const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){7,14}(\s*)?$/)
    .required(),
});

const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const data = await listContacts();
  res.status(200).json({ message: data });
});

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const data = await getContactById(id);
  data
    ? res.status(200).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = schema.validate({ name, email, phone });

  error
    ? res.status(400).json({ message: error.message })
    : res
        .status(201)
        .json({ message: await addContact({ name, email, phone }) });
});

router.delete('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const data = await removeContact(id);
  data
    ? res.status(200).json({ message: 'contact deleted' })
    : res.status(404).json({ message: 'not found' });
});

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const { name, email, phone } = req.body;
  const { error } = schema.validate({ name, email, phone });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const data = await updateContact(id, { name, email, phone });

  data
    ? res.status(201).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

module.exports = router;
