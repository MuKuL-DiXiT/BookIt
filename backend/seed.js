require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const PromoCode = require('./models/PromoCode');
const connectDB = require('./config/db');

// Sample experience data with royalty-free images from Unsplash
const experiences = [
  {
    title: "Sunrise Hot Air Balloon Ride",
    description: "Experience the magic of floating above the clouds during sunrise. Our hot air balloon adventure offers breathtaking panoramic views of the landscape below. Perfect for special occasions or creating unforgettable memories. Includes pre-flight briefing, approximately 1 hour flight time, and post-flight celebration with refreshments.",
    shortDescription: "Soar above the clouds and witness a spectacular sunrise from a hot air balloon",
    image: "https://images.unsplash.com/photo-1498550744921-75f79806b163",
    images: [
      "https://images.unsplash.com/photo-1498550744921-75f79806b163",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e"
    ],
    location: "Jaipur, Rajasthan",
    duration: "3 hours",
    category: "Adventure",
    rating: 4.8,
    reviewCount: 156,
    basePrice: 8999,
    highlights: [
      "Witness breathtaking sunrise views",
      "Professional and experienced pilots",
      "Complimentary refreshments",
      "Flight certificate included",
      "Small group experience (max 8 people)"
    ],
    includes: [
      "Pre-flight safety briefing",
      "1 hour hot air balloon flight",
      "Post-flight celebration with refreshments",
      "Flight certificate",
      "Hotel pickup and drop-off"
    ],
    excludes: [
      "Personal insurance",
      "Gratuities",
      "Photography services"
    ],
    slots: generateSlots(8999, 30)
  },
  {
    title: "Scuba Diving Adventure",
    description: "Dive into the crystal-clear waters and explore the vibrant underwater world. Our scuba diving experience is perfect for both beginners and experienced divers. Discover colorful coral reefs, exotic marine life, and underwater caves. All equipment provided, with PADI certified instructors ensuring your safety throughout.",
    shortDescription: "Explore the underwater paradise with professional PADI certified instructors",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
    ],
    location: "Andaman Islands",
    duration: "4 hours",
    category: "Water Sports",
    rating: 4.9,
    reviewCount: 203,
    basePrice: 6499,
    highlights: [
      "PADI certified instructors",
      "All diving equipment included",
      "Explore coral reefs and marine life",
      "Underwater photography available",
      "Suitable for beginners"
    ],
    includes: [
      "Complete diving equipment",
      "Professional instruction",
      "Safety briefing and training",
      "Underwater guide",
      "Light refreshments"
    ],
    excludes: [
      "Underwater photography (available for extra cost)",
      "Personal insurance",
      "Transportation"
    ],
    slots: generateSlots(6499, 30)
  },
  {
    title: "Mountain Trekking Expedition",
    description: "Embark on an unforgettable journey through scenic mountain trails. Our guided trekking expedition takes you through pristine forests, alongside rushing streams, and up to breathtaking viewpoints. Perfect for nature lovers and adventure seekers. Experience includes camping under the stars and traditional mountain cuisine.",
    shortDescription: "Trek through scenic mountain trails with experienced guides",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5"
    ],
    location: "Manali, Himachal Pradesh",
    duration: "Full day (8 hours)",
    category: "Adventure",
    rating: 4.7,
    reviewCount: 189,
    basePrice: 4999,
    highlights: [
      "Professional mountain guides",
      "Scenic viewpoints",
      "Traditional mountain lunch",
      "All trekking equipment provided",
      "Small group size (max 12 people)"
    ],
    includes: [
      "Experienced trek leader",
      "All meals during trek",
      "Trekking equipment",
      "First aid kit",
      "Transportation to trek base"
    ],
    excludes: [
      "Personal trekking gear",
      "Travel insurance",
      "Any personal expenses"
    ],
    slots: generateSlots(4999, 30)
  },
  {
    title: "Wildlife Safari Experience",
    description: "Get up close with nature's magnificent creatures on our guided wildlife safari. Journey through natural habitats in open-top vehicles with expert naturalists who'll help you spot tigers, elephants, leopards, and numerous bird species. Includes early morning and late afternoon safari drives when wildlife is most active.",
    shortDescription: "Spot exotic wildlife in their natural habitat with expert naturalists",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      "https://images.unsplash.com/photo-1549366021-9f761d450615",
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44"
    ],
    location: "Jim Corbett National Park",
    duration: "Full day",
    category: "Nature",
    rating: 4.6,
    reviewCount: 142,
    basePrice: 5999,
    highlights: [
      "Expert naturalist guides",
      "Open-top safari vehicles",
      "Two safari drives (morning & evening)",
      "High chance of wildlife sightings",
      "Lunch at resort included"
    ],
    includes: [
      "Two safari drives",
      "Expert naturalist guide",
      "All meals",
      "Park entry fees",
      "Binoculars provided"
    ],
    excludes: [
      "Camera fees (if applicable)",
      "Personal expenses",
      "Travel insurance"
    ],
    slots: generateSlots(5999, 30)
  },
  {
    title: "Paragliding Adventure",
    description: "Feel the ultimate rush of adrenaline as you soar through the sky like a bird. Our tandem paragliding experience offers spectacular aerial views of mountains and valleys. Fly with experienced pilots who ensure a safe and thrilling adventure. Perfect for first-timers and adventure enthusiasts alike.",
    shortDescription: "Soar through the skies and experience the thrill of flight",
    image: "https://images.unsplash.com/photo-1522057306606-62c10249f3a0",
    images: [
      "https://images.unsplash.com/photo-1522057306606-62c10249f3a0",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20"
    ],
    location: "Bir Billing, Himachal Pradesh",
    duration: "2-3 hours",
    category: "Adventure",
    rating: 4.9,
    reviewCount: 267,
    basePrice: 3999,
    highlights: [
      "Certified professional pilots",
      "Spectacular mountain views",
      "GoPro video recording available",
      "Safety equipment included",
      "Suitable for first-timers"
    ],
    includes: [
      "Tandem paragliding flight (20-30 min)",
      "All safety equipment",
      "Pre-flight briefing",
      "Insurance coverage",
      "Transportation to launch site"
    ],
    excludes: [
      "GoPro video recording (₹500 extra)",
      "Personal expenses",
      "Food and beverages"
    ],
    slots: generateSlots(3999, 30)
  },
  {
    title: "Cultural Heritage Walk",
    description: "Immerse yourself in the rich cultural heritage of ancient temples, palaces, and traditional markets. Our expert guides share fascinating stories and historical insights as you explore architectural marvels and hidden gems. Experience authentic local cuisine and traditional crafts along the way.",
    shortDescription: "Explore historical monuments and traditional markets with expert guides",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
      "https://images.unsplash.com/photo-1532664189809-02133fee698d"
    ],
    location: "Jaipur, Rajasthan",
    duration: "4 hours",
    category: "Cultural",
    rating: 4.5,
    reviewCount: 98,
    basePrice: 1999,
    highlights: [
      "Visit UNESCO heritage sites",
      "Expert local historians as guides",
      "Traditional Rajasthani lunch",
      "Artisan craft demonstrations",
      "Small intimate groups"
    ],
    includes: [
      "Professional guide",
      "All entry fees",
      "Traditional lunch",
      "Refreshments",
      "Artisan workshop visit"
    ],
    excludes: [
      "Personal purchases",
      "Gratuities",
      "Transportation"
    ],
    slots: generateSlots(1999, 30)
  },
  {
    title: "River Rafting Expedition",
    description: "Navigate through exciting rapids and calm waters on this thrilling river rafting adventure. Perfect for groups and families looking for an adrenaline rush. Our experienced river guides ensure safety while providing an unforgettable experience. Includes all safety gear and basic rafting training.",
    shortDescription: "Navigate thrilling rapids with professional river guides",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1544551763-92ed6a3ee73f",
      "https://images.unsplash.com/photo-1565031491910-e67fcf6d4a9c"
    ],
    location: "Rishikesh, Uttarakhand",
    duration: "5 hours",
    category: "Adventure",
    rating: 4.8,
    reviewCount: 224,
    basePrice: 2999,
    highlights: [
      "Grade II-III rapids",
      "Professional rafting guides",
      "All safety equipment included",
      "Riverside lunch",
      "Cliff jumping opportunity"
    ],
    includes: [
      "River rafting (16 km stretch)",
      "Professional guide",
      "All safety equipment",
      "Riverside lunch",
      "Transportation to/from rafting point"
    ],
    excludes: [
      "Waterproof camera rental",
      "Personal expenses",
      "Travel insurance"
    ],
    slots: generateSlots(2999, 30)
  },
  {
    title: "Yoga & Meditation Retreat",
    description: "Rejuvenate your mind, body, and soul with our comprehensive yoga and meditation retreat. Set in a peaceful environment surrounded by nature, learn from experienced yoga instructors. Includes multiple yoga sessions, guided meditation, healthy vegetarian meals, and wellness consultations.",
    shortDescription: "Find inner peace with expert-led yoga and meditation sessions",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
      "https://images.unsplash.com/photo-1588286840104-8957b019727f"
    ],
    location: "Rishikesh, Uttarakhand",
    duration: "Half day (4 hours)",
    category: "Wellness",
    rating: 4.7,
    reviewCount: 132,
    basePrice: 2499,
    highlights: [
      "Certified yoga instructors",
      "Scenic riverside location",
      "Guided meditation sessions",
      "Healthy vegetarian meals",
      "Wellness consultation"
    ],
    includes: [
      "Two yoga sessions",
      "Guided meditation",
      "Healthy meals",
      "Wellness consultation",
      "Yoga mat and props"
    ],
    excludes: [
      "Accommodation",
      "Personal expenses",
      "Transportation"
    ],
    slots: generateSlots(2499, 30)
  }
];

// Generate promo codes
const promoCodes = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 2000,
    maxDiscount: 1000,
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 100,
  },
  {
    code: 'FLAT100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 1000,
    maxDiscount: null,
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 200,
  },
  {
    code: 'FIRST500',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 5000,
    maxDiscount: null,
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 50,
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 3000,
    maxDiscount: 2000,
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 150,
  }
];

// Function to generate slots for next 30 days
function generateSlots(basePrice, days = 30) {
  const slots = [];
  const timeSlots = [
    { time: '06:00 AM - 09:00 AM', multiplier: 1.2 },
    { time: '09:00 AM - 12:00 PM', multiplier: 1 },
    { time: '12:00 PM - 03:00 PM', multiplier: 0.9 },
    { time: '03:00 PM - 06:00 PM', multiplier: 1.1 },
    { time: '06:00 PM - 09:00 PM', multiplier: 1.3 }
  ];

  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Generate 2-4 random time slots per day
    const numSlots = Math.floor(Math.random() * 3) + 2;
    const selectedTimeSlots = timeSlots
      .sort(() => 0.5 - Math.random())
      .slice(0, numSlots);

    selectedTimeSlots.forEach(slot => {
      const slotPrice = Math.round(basePrice * slot.multiplier);
      const totalSeats = Math.floor(Math.random() * 8) + 4; // 4-12 seats
      const bookedSeats = Math.floor(Math.random() * (totalSeats * 0.3)); // 0-30% booked
      
      slots.push({
        date: date,
        timeSlot: slot.time,
        availableSeats: totalSeats - bookedSeats,
        totalSeats: totalSeats,
        price: slotPrice
      });
    });
  }

  return slots.sort((a, b) => a.date - b.date);
}

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});

    // Insert experiences
    console.log('🌱 Seeding experiences...');
    await Experience.insertMany(experiences);
    console.log(`✅ ${experiences.length} experiences added`);

    // Insert promo codes
    console.log('🌱 Seeding promo codes...');
    await PromoCode.insertMany(promoCodes);
    console.log(`✅ ${promoCodes.length} promo codes added`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
