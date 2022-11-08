const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
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
  res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const data = await removeContact(id);
  data
    ? res.status(200).json({ message: 'contact deleted' })
    : res.status(404).json({ message: 'not found' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
