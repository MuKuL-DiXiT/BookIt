const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true, // e.g., "10:00 AM - 12:00 PM"
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true, // e.g., "2 hours", "Half day"
  },
  category: {
    type: String,
    required: true, // e.g., "Adventure", "Cultural", "Nature"
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  highlights: [{
    type: String,
  }],
  includes: [{
    type: String,
  }],
  excludes: [{
    type: String,
  }],
  slots: [slotSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Experience', experienceSchema);
