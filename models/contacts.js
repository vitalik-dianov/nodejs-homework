const { Contacts } = require('../db/contactsModel');
const listContacts = async ownerId => {
  try {
    const response = await Contacts.find({ owner: ownerId });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (contactId, ownerId) => {
  try {
    const response = await Contacts.findOne({
      _id: contactId,
      owner: ownerId,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId, ownerId) => {
  try {
    const response = await Contacts.findOneAndRemove({
      _id: contactId,
      owner: ownerId,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (body, ownerId) => {
  try {
    console.log(body);
    const response = await Contacts.create({
      ...body,
      owner: ownerId,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, ownerId, body) => {
  try {
    const response = await Contacts.findOneAndUpdate(
      { _id: contactId, owner: ownerId },
      {
        $set: body,
      }
    );
    if (!response) {
      return response;
    }
    return getContactById(contactId, ownerId);
  } catch (error) {
    return error.message;
  }
};

const updateStatusContact = async (contactId, ownerId, body) => {
  const { favorite } = body;
  if (favorite === undefined) {
    return 'missing field favorite';
  }

  try {
    const response = await Contacts.findOneAndUpdate(
      { _id: contactId, owner: ownerId },
      {
        $set: { favorite },
      }
    );
    if (!response) {
      return response;
    }
    return getContactById(contactId, ownerId);
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
