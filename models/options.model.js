const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  customFields: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model('Option', optionSchema);
