const argv = require('yargs').argv;
const handleContactsMethods = require('./contacts');

const listContacts = handleContactsMethods.listContacts;
const getContactById = handleContactsMethods.getContactById;
const addContact = handleContactsMethods.addContact;
const removeContact = handleContactsMethods.removeContact;

function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
      case 'list':
        console.table(listContacts());
        break;
  
      case 'get':
        console.table(getContactById(id));
        break;
  
      case 'add':
        addContact({ name, email, phone });
        console.table(listContacts());
        break;
  
      case 'remove':
        removeContact(id);
        console.table(listContacts());
        break;
  
      default:
        console.warn('\x1B[31m Unknown action type!');
    }
  }
  
  invokeAction(argv);