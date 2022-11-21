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

const {
  authMiddleware,
} = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  const ownerId = req.user._id;
  const data = await listContacts(ownerId);
  res.status(200).json({ message: data });
});

router.get('/:contactId', authMiddleware, async (req, res, next) => {
  const contactId = req.params.contactId;
  const ownerId = req.user._id;
  const data = await getContactById(contactId, ownerId);
  data
    ? res.status(200).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

router.post('/', authMiddleware, async (req, res, next) => {
  const ownerId = req.user._id;
  const { error } = schema.validate(req.body);

  error
    ? res.status(400).json({ message: error.message })
    : res
        .status(201)
        .json({ message: await addContact(req.body, ownerId) });
});

router.delete(
  '/:contactId',
  authMiddleware,
  async (req, res, next) => {
    const ownerId = req.user._id;
    const contactId = req.params.contactId;
    const data = await removeContact(contactId, ownerId);

    data
      ? res.status(200).json({ message: 'contact deleted' })
      : res.status(404).json({ message: 'not found' });
  }
);

router.put('/:contactId', authMiddleware, async (req, res, next) => {
  const ownerId = req.user._id;
  const contactsId = req.params.contactId;
  const { name, email, phone, favorite } = req.body;
  const { error } = schema.validate({ name, email, phone, favorite });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const data = await updateContact(contactsId, ownerId, req.body);

  data
    ? res.status(200).json({ message: data })
    : res.status(404).json({ message: 'Not found' });
});

router.patch(
  '/:contactId/favorite',
  authMiddleware,
  async (req, res, next) => {
    const contactsId = req.params.contactId;
    const ownerId = req.user._id;
    const data = await updateStatusContact(
      contactsId,
      ownerId,
      req.body
    );

    data
      ? res.status(200).json({ message: data })
      : res.status(404).json({ message: 'Not found' });
  }
);

module.exports = router;
