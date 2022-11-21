const mongoose = require('mongoose');

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contacts = mongoose.model('contacts', contactsSchema);

module.exports = {
  Contacts,
};
