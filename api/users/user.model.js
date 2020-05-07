const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const shortId = require('shortid');
const contactModel = require('../contacts/contact.model');

const {Schema, model} = mongoose;

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  otpCode: String,
  registered: { type: Boolean, default: false },
  token: String,
  contact: {
    name: {type: String, default: null},
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact' }
  }
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.verifyUser = verifyUser;
userSchema.statics.verifyToken = verifyToken;
userSchema.statics.updateToken = updateToken;
userSchema.statics.deleteToken = deleteToken;
userSchema.statics.createOTPCode = createOTPCode;
userSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
userSchema.statics.findContactByEmailAndUpdate = findContactByEmailAndUpdate;

dotenv.config();

async function findUserByIdAndUpdate(id, updateParams) {
  return await this.findByIdAndUpdate(id, {$set: updateParams}, {runValidators: true, new: true});
}

async function findUserByEmail(email) {
  return await this.findOne({email});
}

async function verifyUser(id) {
  return await this.findUserByIdAndUpdate(id, {
    registered: true,
    otpCode: null
  });
}

async function verifyToken(token) {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null
  }
}

async function updateToken(id, name, contactId) {
  const token = await jwt.sign(
    {id},  
    process.env.JWT_SECRET, 
    {expiresIn: 2 * 24 * 60 * 60} // two days
  );
  
  const updateParams = name && contactId ? { token, contact: {name, contactId} } : { token };

  return await this.findByIdAndUpdate(id, {$set: updateParams}, {new: true});
}

async function deleteToken(id) {
  return await this.findUserByIdAndUpdate(id, {token: null});
}

async function createOTPCode() {
  const otpCode = shortId();
  return otpCode;
}

async function findContactByIdAndUpdate(contactId, updateParams) {
  return await contactModel.findByIdAndUpdate(contactId, {$set: updateParams}, {new: true})
}

async function findContactByEmailAndUpdate(email) {
  const existingContact = await contactModel.findOne({email});

  if(!existingContact) return false;

  await contactModel.findByIdAndUpdate(existingContact._id, {user: {subscription}});
  
  return true
}

// create users collection
const userModel = model('User', userSchema);

module.exports = userModel;