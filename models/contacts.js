const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => {
  try {
    const response = JSON.parse(
      await fs.readFile(contactsPath, 'utf8')
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async contactId => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf8'));
    const [response] = data.filter(item => item.id === contactId);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async contactId => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf8'));
    const index = data.findIndex(item => item.id === contactId);

    if (index === -1) {
      return false;
    }

    data.splice(index, 1);

    fs.writeFile(contactsPath, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async body => {
  try {
    const { name, email, phone } = body;
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf8'));
    const newContact = { id: uuidv4(), name, email, phone };
    const newData = [...data, newContact];

    fs.writeFile(contactsPath, JSON.stringify(newData));
    return newContact;
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf8'));
    const [response] = data.filter(item => item.id === contactId);

    if (!response) {
      return response;
    }

    data.forEach(item => {
      if (item.id === contactId) {
        item.name = name;
        item.email = email;
        item.phone = phone;
      }
    });

    fs.writeFile(contactsPath, JSON.stringify(data));

    return data.find(item => item.id === contactId);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
