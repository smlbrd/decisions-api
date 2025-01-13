require("dotenv").config();
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8/"
/* put back into uri process.env.URI; */ // dotenv URI
const mongoose = require("mongoose");
//Provides the methods/schemas/and more to interact with the db
// Database connection: Uniform Resource Identifier

async function connectDb() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!!!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDb().catch((err) => {
    console.log("Err - database not connected", err)
})

module.exports = connectDb;
