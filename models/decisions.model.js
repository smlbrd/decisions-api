const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }],
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true,
      },
      option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
      },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  votingStatus: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model('Decision', decisionSchema);
