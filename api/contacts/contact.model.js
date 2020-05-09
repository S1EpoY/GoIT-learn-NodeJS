const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema, model} = mongoose;

const contactSchema = new Schema({
  idx: {type: Number},
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  user: {
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free"
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }
});

contactSchema.plugin(mongoosePaginate);

contactSchema.statics.createWithIdx = createWithIdx;   
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;   
contactSchema.statics.updateIdxContacts = updateIdxContacts;   
contactSchema.statics.getPaginateUsingParams = getPaginateUsingParams;   
        
async function findContactByIdAndUpdate(contactId, updateParams) {
  return await this.findByIdAndUpdate(contactId, {$set: updateParams}, {new: true});
}

async function createWithIdx(updateParams){
  const idx = await this.countDocuments('name') + 1;
  const newContact = {idx, ...updateParams};

  return await this.create(newContact); 
}


async function updateIdxContacts() {
  const contacts = await this.find();
  const updateIdx = async function (contacts, i) {
    return await this.findOneAndUpdate({name: contacts[i].name}, {idx: i + 1}, {new: true});
  };

  for(let i = 0; i < contacts.length; i++) {
    updateIdx(contacts, i);
  }
}

async function getPaginateUsingParams(page, limit, sub) {
  let options = {};
  let searchParam = {};

  if(page) options = { page };
  if(limit) options = { ...options, limit };
  if(sub) searchParam = {user: {subscription:sub}};

  return await this.paginate(searchParam, options);
}

// create contacts collection
const contactModel = model('Contact', contactSchema);

module.exports = contactModel;