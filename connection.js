const mongoose = require('mongoose'); 
//Provides the methods/schemas/and more to interact with the db

// Database connection: Uniform Resource Identifier 

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/users'; 
  // Use an environment variable or a default URI. - look up env variables

  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;