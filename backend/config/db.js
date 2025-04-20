const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Directly use the connection string from environment variables
    const connectString = process.env.MONGO_URI;
    
    // Remove deprecated options
    await mongoose.connect(connectString);
    
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;