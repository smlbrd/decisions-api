require('dotenv').config();
const uri = process.env.URI;

const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(uri);

  mongoose.connection.once('open', () => {
    console.log('Connected to the database');
  });

  mongoose.connection.on('error', console.error);
};

module.exports = connectDB;
