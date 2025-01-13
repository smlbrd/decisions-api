const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    list_name: { type: String, required: true },
    list_desc: { type: String, required: true },

});

module.exports = mongoose.model('List', listSchema);