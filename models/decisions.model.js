const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Option',
          required: true,
        },
      },
      { timestamps: true },
    ],
    votingStatus: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'not started',
    },
    decisionsProcess_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DecisionsProcess',
      required: true,
    },
    saveData: { type: Object, default: {} },
    completedAt: { type: Date },
    outcome: { type: mongoose.Schema.Types.ObjectId, ref: Options },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Decision', decisionSchema);
