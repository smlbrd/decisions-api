require('dotenv').config();
const uri = process.env.URI;

const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(uri);

    console.log('Connected to the database');
  } catch (error) {
    console.log('Database error:', error);
  }
}

module.exports = connectDB;
