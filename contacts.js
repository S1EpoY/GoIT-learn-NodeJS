const path = require('path');
const fs = require('fs');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');



/**
  * returns a contact list database
  */
function listContacts() {
    const contacts =  JSON.parse(
        fs.readFileSync(contactsPath, 'utf-8', (err) => {
            if (err) throw err;
        }
    ));

    console.log('Contacts was readed!');
    
    return contacts;
};


/**
 * finds contact by specified id
 */
function getContactById(contactId) {
    const contacts = listContacts();
    for(let i = 0; i < contacts.length; i++) {
        if(contacts[i].id === contactId) {
            console.log(`Contact with id:${contactId} was find!`)
            return contacts[i]
        }; 
    }
    console.log(`Contact with id:${contactId} is undefined!`);
    return null;
};


/**
 * adds a new contact to the contact list database
 */
function addContact(newContact = { id, name, email, phone }) {
    const contacts = listContacts();

    fs.writeFileSync(contactsPath, JSON.stringify([...contacts, newContact]), (err) => {
        if (err) throw err;
    });

    console.log('Contact was added!');
};


/**
 * updates the contact with the specified id
 */
function updateContact(updatedContact = { id, ...rest }) {
    const {id} = updatedContact;
    const desiredResult = getContactById(id);
    if(desiredResult === null) return null;
    console.log('updatedContact', updatedContact)

    const contacts = listContacts();
    let finedContact = null;
    
    for(let i = 0; i < contacts.length; i++) {
        if(contacts[i].id === id) {
            Object.assign(contacts[i], updatedContact);
            finedContact = {...contacts[i]};
            console.log(`Contact with id:${id} was update!`);
        }; 
    }

    fs.writeFileSync(contactsPath, JSON.stringify([...contacts]), (err) => {
        if (err) throw err;
    });

    return finedContact; 
}


/**
 * removes the contact with the specified id
 */
function removeContact(contactId) {
    const contacts = listContacts();
    const newContacts = [];
    let currentId = 0;

    if(getContactById(contactId) === null) return null;

    for(let i = 0; i < contacts.length; i++) {
        if(contacts[i].id !== contactId) {
            newContacts.push({ ...contacts[i], id: currentId += 1 });
        } ; 
    }

    fs.writeFileSync(contactsPath, JSON.stringify(newContacts), (err) => {
        if (err) throw err;
    });
    console.log(`Contact with id:${contactId} was remove!`);
    return true;
};


/**
 * calls the appropriate method for working with the contacts database passing him the necessary arguments
 */
function invokeAction({
    action,
    id,
    name,
    email,
    phone
  }) {
    switch (action) {
      case 'list':
        console.table(listContacts());
        break;
  
      case 'get':
        console.table(getContactById(id));
        break;
  
      case 'add':
        addContact({
          name,
          email,
          phone
        });
        console.table(listContacts());
        break;
  
      case 'update':
        console.table(updateContact({
          id,
          name
          // email,
          // phone
        }));
        break;
  
      case 'remove':
        removeContact(id);
        console.table(listContacts());
        break;
  
      default:
        console.warn('\x1B[31m Unknown action type!');
    }
  }



module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
    invokeAction
}