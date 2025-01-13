const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
});

const User = mongoose.model('User', userSchema);

userSchema.statics.getUserByName = function (name) {
  return this.find({ username: new RegExp(name, 'i') }); // find all users matching case insensitive version of input variable
};

module.exports = { User, getUserByName };
