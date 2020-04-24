const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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
  token: String,
  // contact: { type: mongoose.Schema.ObjectId, ref: 'Contact' }
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.verifyToken = verifyToken;
userSchema.statics.updateToken = updateToken;
userSchema.statics.deleteToken = deleteToken;

dotenv.config();

async function findUserByIdAndUpdate(id, updateParams) {
  return await this.findByIdAndUpdate(id, {$set: updateParams}, {runValidators: true, new: true});
}

async function findUserByEmail(email) {
  return await this.findOne({email});
}

async function verifyToken(token) {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null
  }
}

async function updateToken(id) {
  const token = await jwt.sign(
    {id},  
    process.env.JWT_SECRET, 
    {expiresIn: 2 * 24 * 60 * 60} // two days
  );
  return await this.findByIdAndUpdate(id, {token: token}, {new: true});
}

async function deleteToken(id) {
  return await this.findByIdAndUpdate(id, {token: null}, {new: true});
}

// create users collection
const userModel = model('User', userSchema);

module.exports = userModel;