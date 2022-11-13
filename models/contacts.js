const { Contacts } = require('../db/contactsModel');
const listContacts = async () => {
  try {
    const response = await Contacts.find({});
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async contactId => {
  try {
    const response = await Contacts.findById(contactId);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async contactId => {
  try {
    const response = await Contacts.findByIdAndRemove(contactId);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async body => {
  try {
    const response = await Contacts.create(body);
    return response;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const response = await Contacts.findByIdAndUpdate(contactId, {
      $set: body,
    });
    if (!response) {
      return response;
    }
    return getContactById(contactId);
  } catch (error) {
    return error.message;
  }
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  if (favorite === undefined) {
    return 'missing field favorite';
  }

  try {
    const response = await Contacts.findByIdAndUpdate(contactId, {
      $set: { favorite },
    });
    if (!response) {
      return response;
    }
    return getContactById(contactId);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
