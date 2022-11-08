const fs = require('fs').promises;
const path = require('path');
// const { v4: uuidv4 } = require('uuid');

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
    console.table(index);
    if (index === -1) {
      return false;
    }
    
    data.splice(index, 1);
    // console.table( data)
    fs.writeFile(contactsPath, JSON.stringify(data))
    return true;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async body => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
