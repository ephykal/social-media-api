const mongoose = require('mongoose')
const url = process.env.MONGO_URL

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection error', error);
    process.exit(1);
  }
};

module.exports = connectDB