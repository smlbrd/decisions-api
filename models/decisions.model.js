const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true }, // reference to list used in decision
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    }, // reference to group invited to decision
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        }, // which user voted
        option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Option',
          required: true,
        },
      }, // what that user voted for
      { timestamps: true }, // timestamps for vote interactions
    ],
    votingStatus: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'not started',
    }, // 3 permitted states for a decision
    decisionsProcess_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DecisionsProcess',
      required: true,
    }, // reference to which process was used in a decision
    saveData: { type: Object, default: {} }, // flexible field for capturing data needed for processes
    completedAt: { type: Date }, // date the vote was closed / winner was decided
    outcome: { type: mongoose.Schema.Types.ObjectId, ref: Options }, // the winner of the vote
  },
  { timestamps: true } // timestamps for decision
);

module.exports = mongoose.model('Decision', decisionSchema);
