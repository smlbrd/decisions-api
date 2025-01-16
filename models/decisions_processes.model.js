const mongoose = require('mongoose');

const restrictionsSchema = new mongoose.Schema(
  {
    minGroupSize: { type: Number, required: true },
    maxGroupSize: { type: Number },
  },
  { _id: false }
);

const decisionsProcessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    restrictions: { type: restrictionsSchema },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DecisionsProcess', decisionsProcessSchema);
