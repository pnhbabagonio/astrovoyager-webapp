export const locationsData = [
  {
    id: 'ph',
    name: 'Philippines',
    coordinates: { x: 75, y: 48 }, // Relative coordinates for Earth image
    description: 'Tropical country near the equator',
    climate: 'Tropical',
    latitude: '13°N',
    fact: 'The Philippines experiences nearly equal day and night throughout the year due to its proximity to the equator.'
  },
  {
    id: 'ca',
    name: 'Canada',
    coordinates: { x: 30, y: 25 },
    description: 'Northern country in North America',
    climate: 'Temperate to Arctic',
    latitude: '56°N',
    fact: 'Canada experiences extreme variations in daylight hours between summer and winter due to its northern latitude.'
  },
  {
    id: 'au',
    name: 'Australia',
    coordinates: { x: 85, y: 70 },
    description: 'Southern continent-country',
    climate: 'Various (mostly arid to temperate)',
    latitude: '25°S',
    fact: 'Australia has opposite seasons compared to northern hemisphere countries.'
  }
];

export const conceptQuestions = [
  {
    id: 1,
    question: "What happens when Earth is tilted?",
    options: [
      { id: 'days-change', text: "Days change" },
      { id: 'days-same', text: "Days stay the same" }
    ],
    correctAnswer: 'days-change',
    explanation: "Earth's tilt causes different parts of Earth to receive varying amounts of sunlight throughout the year, leading to changing day lengths."
  },
  {
    id: 2,
    question: "Why do days become longer or shorter?",
    options: [
      { id: 'earth-tilted', text: "Earth is tilted" },
      { id: 'earth-closer', text: "Earth is closer to the Sun" }
    ],
    correctAnswer: 'earth-tilted',
    explanation: "The changing distance from the Sun has minimal effect. It's Earth's 23.5° tilt that causes seasons and varying day lengths."
  }
];

export const seasonsData = {
  'equinox': {
    position: 50,
    name: 'Equinox',
    description: 'Equal day and night at equator'
  },
  'summer-solstice-north': {
    position: 0,
    name: 'Summer Solstice (Northern)',
    description: 'Longest day in Northern Hemisphere'
  },
  'winter-solstice-north': {
    position: 100,
    name: 'Winter Solstice (Northern)',
    description: 'Shortest day in Northern Hemisphere'
  }
};

// Helper function to calculate daylight hours
export const calculateDaylight = (locationId, tilt, position, season) => {
  // Simplified daylight calculation
  // In a real app, this would use astronomical formulas
  
  const baseHours = 12;
  
  if (!tilt) return baseHours;
  
  let variation = 0;
  
  switch(locationId) {
    case 'ph': // Philippines (near equator)
      variation = Math.sin((position - 50) * Math.PI / 100) * 1;
      break;
    case 'ca': // Canada (northern)
      variation = Math.sin((position - 50) * Math.PI / 100) * 6;
      break;
    case 'au': // Australia (southern)
      variation = Math.sin((position - 50) * Math.PI / 100) * -6; // Opposite phase
      break;
    default:
      variation = 0;
  }
  
  return Math.max(6, Math.min(18, baseHours + variation));
};