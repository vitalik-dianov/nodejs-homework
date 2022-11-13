const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){7,14}(\s*)?$/)
    .required(),
  favorite: Joi.boolean(),
});

const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
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
  const { error } = schema.validate(req.body);

  error
    ? res.status(400).json({ message: error.message })
    : res.status(201).json({ message: await addContact(req.body) });
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
  const { name, email, phone, favorite } = req.body;
  const { error } = schema.validate({ name, email, phone, favorite });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const data = await updateContact(id, req.body);

  data
    ? res.status(200).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  const id = req.params.contactId;
  const data = await updateStatusContact(id, req.body);

  data
    ? res.status(200).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

module.exports = router;
