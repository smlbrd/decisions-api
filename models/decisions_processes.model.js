const mongoose = require('mongoose');

const restrictionsSchema = new mongoose.Schema(
  {
    minGroupSize: { type: Number, required: true }, // minimum number of participants
    maxGroupSize: { type: Number }, // optional maximum
  },
  { _id: false } // nested restrictions won't need/have a unique id
);

const decisionsProcessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "this or that", "single elimination"
    description: { type: String, required: true }, // e.g. "choose between two options, winner stays on!"
    restrictions: { type: restrictionsSchema },
  },
  { timestamps: true } // automatically manage createdAt and updatedAt
);

module.exports = mongoose.model('DecisionsProcess', decisionsProcessSchema);
