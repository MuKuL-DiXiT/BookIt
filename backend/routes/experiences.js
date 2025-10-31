const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET /experiences/search?q=searchTerm - Search experiences
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Create case-insensitive regex for search
    const searchRegex = new RegExp(searchQuery, 'i');
    
    // Search in title, description, location, and category
    const experiences = await Experience.find({
      isActive: true,
      $or: [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
      ],
    })
      .select('-slots')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: experiences.length,
      query: searchQuery,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching experiences',
      error: error.message,
    });
  }
});

router.get('/', async (req, res) => {
    console.log('Fetching all experiences');
  try {
    const experiences = await Experience.find({ isActive: true })
      .select('-slots') // Don't send all slots in list view
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message,
    });
  }
});

// GET /experiences/:id - Get single experience with slots
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    // Filter out past dates and sort slots
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    experience.slots = experience.slots.filter(slot => {
      const slotDate = new Date(slot.date);
      slotDate.setHours(0, 0, 0, 0);
      return slotDate >= currentDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience',
      error: error.message,
    });
  }
});

module.exports = router;
