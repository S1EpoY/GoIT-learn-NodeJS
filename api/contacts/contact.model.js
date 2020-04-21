const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema, model} = mongoose;

const contactSchema = new Schema({
    idx: {type: Number},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true}
});

contactSchema.plugin(mongoosePaginate);

contactSchema.statics.createWithIdx = createWithIdx;   
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;   
contactSchema.statics.updateIdxContacts = updateIdxContacts;   


async function createWithIdx(updateParams){
    const idx = await this.countDocuments('name') + 1;
    const newContact = {idx, ...updateParams};

    return await this.create(newContact); 
}
    
    
async function findContactByIdAndUpdate(contactId, updateParams) {
        return await this.findByIdAndUpdate(contactId, {$set: updateParams}, {new: true});
}

async function updateIdxContacts() {
      const updateIdx = async (contacts, i) => await this.findOneAndUpdate({name: contacts[i].name}, {idx: i + 1}, {new: true});
      const contacts = await this.find();

      for(let i = 0; i < contacts.length; i++) {
        updateIdx(contacts, i);
      }
  }

// create contacts collection
const contactModel = model('Contact', contactSchema);

module.exports = contactModel;