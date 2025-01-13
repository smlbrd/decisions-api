const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: "Option" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model("List", listSchema);
