const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('your_connection_string_here', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

const DogSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    isGoodBoy: {
      type: Boolean,
      required: false,
      default: true,
    },
  });

module.exports = connectDB;
