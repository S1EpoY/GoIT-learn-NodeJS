const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String,
});

userSchema.plugin(mongoosePaginate);

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.verifyToken = verifyToken;
userSchema.statics.updateToken = updateToken;
userSchema.statics.deleteToken = deleteToken;

async function findUserByEmail(email) {
  return await this.findOne({email});
}

async function verifyToken(token) {
  return await jwt.verify(token, process.env.JWT_SECRET).id;
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