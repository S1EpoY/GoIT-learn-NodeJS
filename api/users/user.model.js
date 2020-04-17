const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;

async function findUserByEmail(email) {
  return await this.findOne({email})
}

async function updateToken(id, newToken) {
  return await this.findByIdAndUpdate(id, {token: newToken});
}

// users
const userModel = model('User', userSchema);

module.exports = userModel;