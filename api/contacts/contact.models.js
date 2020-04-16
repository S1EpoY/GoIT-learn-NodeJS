const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const contactSchema = new Schema({
    idx: {type: Number},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true}   
});

contactSchema.statics.createWithIdx = createWithIdx;   
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;   
contactSchema.statics.updateIdxContacts = updateIdxContacts;   


async function createWithIdx(updateParams){
    const idx = await contactModel.countDocuments('name') + 1;
    const newContact = {idx, ...updateParams};

    await contactModel.create(newContact); 
}
    
    
async function findContactByIdAndUpdate(contactId, updateParams) {
    try{
        return await this.findByIdAndUpdate(contactId, {$set: updateParams}, {new: true}); 
    } catch(err) {
        console.log(err);
    }
}

async function updateIdxContacts() {
    try {
      const updateIdx = async (contacts, i) => await contactModel.findOneAndUpdate({name: contacts[i].name}, {idx: i + 1}, {new: true});
      const contacts = await contactModel.find();

      for(let i = 0; i < contacts.length; i++) {
        updateIdx(contacts, i);
      }

    } catch(err) {
      console.log(err);
    }
  }

//contacts
const contactModel = model('Contact', contactSchema);

module.exports = contactModel;