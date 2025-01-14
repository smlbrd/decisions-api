const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  savedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
});

module.exports = mongoose.model('User', userSchema);
