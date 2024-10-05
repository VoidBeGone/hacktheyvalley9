const mongoose = require('mongoose');

const ImageEntry = new mongoose.Schema({
    _id: {
      type: Number,
      required: true,
    },
    date_added: {
      type: Date,
      required: true,
    },
    image: {
        type: File,
        required: true
    },
    food: [{
      type: Food
    }]
  });

const Food = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    }
})