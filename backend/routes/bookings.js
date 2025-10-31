const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const mongoose = require('mongoose');

// POST /bookings - Create a new booking
router.post('/', async (req, res) => {
  
  console.log('Creating a new booking');

  try {
    const {
      experienceId,
      slotId,
      customerInfo,
      pricing,
    } = req.body;

    // Validation
    if (!experienceId || !slotId || !customerInfo || !pricing) {

      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }
    console.log('Received booking request for experience:', experienceId, 'slot:', slotId);

    // Validate customer info
    const { name, email, phone, numberOfPeople } = customerInfo;
    if (!name || !email || !phone || !numberOfPeople) {

      return res.status(400).json({
        success: false,
        message: 'Incomplete customer information',
      });
    }
    console.log('Validating customer info for:', email);
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {

      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }


    // Find the experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }
    console.log('experience found')

    // Find the specific slot
    const slot = experience.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }
    console.log('slot found');

    // Check availability
    if (slot.availableSeats < numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: `Only ${slot.availableSeats} seats available for this slot`,
      });
    }
    console.log('available')

    // Update available seats
    slot.availableSeats -= numberOfPeople;

    console.log('creating')
    // Create booking
    const bookingReference = `HD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const booking = new Booking({
      experienceId,
      experienceTitle: experience.title,
      slotId,
      date: slot.date,
      timeSlot: slot.timeSlot,
      customerInfo,
      pricing,
      bookingStatus: 'confirmed',
      bookingReference
    });
    console.log('creating')
    await booking.save()
    console.log('booking created')

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking,
    });

  } catch (error) {
  console.error('❌ Error creating booking:', error.message);
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: 'Server error while creating booking',
    error: error.message,
  });
}

});

// GET /bookings/:reference - Get booking by reference
router.get('/:reference', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.params.reference })
      .populate('experienceId', 'title image location');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
});

module.exports = router;
