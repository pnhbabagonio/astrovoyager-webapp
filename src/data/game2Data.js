export const game2Data = {
  phenomena: [
    {
      id: 1,
      name: 'Typhoon',
      description: 'Tropical cyclone that forms over warm ocean waters',
      icon: '🌀',
      correctRegion: 'Eastern Seaboard',
      explanation: 'Typhoons usually enter the Philippines through the Eastern Seaboard (Bicol, Samar) because this region faces the Pacific Ocean where typhoons form and gain strength.',
      formationFacts: 'Typhoons form over warm ocean waters (26.5°C or warmer) and are fueled by the evaporation of water. The Philippines location in the Western Pacific makes it highly susceptible to typhoons.',
      color: '#4A90E2'
    },
    {
      id: 2,
      name: 'Habagat',
      description: 'Southwest monsoon bringing heavy rainfall',
      icon: '🌧️',
      correctRegion: 'Western Luzon/Visayas',
      explanation: 'The Habagat (Southwest Monsoon) affects Western Luzon and Visayas because it carries moisture from the Indian Ocean and South China Sea, bringing heavy rains to these western areas.',
      formationFacts: 'Habagat occurs from June to September when warm, moist air from the southwest moves toward the Philippines, interacting with the country mountainous terrain to produce rainfall.',
      color: '#7ED321'
    },
    {
      id: 3,
      name: 'Thunderstorm',
      description: 'Localized storm with thunder and lightning',
      icon: '⛈️',
      correctRegion: 'Metro Manila/Lowland Areas',
      explanation: 'Thunderstorms frequently occur in Metro Manila and lowland areas due to heat buildup, urbanization effects, and convergence of air masses in these densely populated regions.',
      formationFacts: 'Thunderstorms form when warm, moist air rises rapidly, cools, and condenses. Urban heat islands in Metro Manila create perfect conditions for thunderstorm development.',
      color: '#9013FE'
    },
    {
      id: 4,
      name: 'El Niño',
      description: 'Warm ocean current causing drought conditions',
      icon: '☀️',
      correctRegion: 'Central Luzon/Mindanao',
      explanation: 'El Niño drought conditions particularly affect Central Luzon and Mindanao, reducing rainfall and causing water shortages that impact agriculture in these major food-producing regions.',
      formationFacts: 'El Niño is a climate pattern characterized by warmer-than-average sea surface temperatures in the central and eastern Pacific, which alters global weather patterns and reduces rainfall in the Philippines.',
      color: '#F5A623'
    },
    {
      id: 5,
      name: 'Amihan',
      description: 'Northeast monsoon bringing cool, dry air',
      icon: '💨',
      correctRegion: 'Northern Luzon',
      explanation: 'Amihan (Northeast Monsoon) primarily affects Northern Luzon, bringing cool, dry air from Siberia and China from November to February, creating the coolest months of the year.',
      formationFacts: 'Amihan occurs when the Northeast Monsoon brings cool, dry air from the Asian continent. It affects mostly Northern and Eastern Luzon, creating the winter season in the Philippines.',
      color: '#50E3C2'
    }
  ],

  scenarios: [
    {
      id: 1,
      phenomenonId: 1,
      questionText: 'TYPHOON SCENARIO: Classes may be suspended due to an approaching typhoon. What would you prepare?',
      choices: [
        { text: 'Prepare first aid kit and emergency supplies', correct: true, explanation: 'Essential for safety during power outages and potential injuries.' },
        { text: 'Play games and wait for the storm', correct: false, explanation: 'Passive approach ignores necessary preparations for safety.' },
        { text: 'Prepare personal entertainment only', correct: false, explanation: 'Focuses on comfort rather than essential safety measures.' },
        { text: 'Wait for Dingdong Dantes to rescue you', correct: false, explanation: 'Celebrity reliance is not a practical emergency plan.' }
      ]
    },
    {
      id: 2,
      phenomenonId: 2,
      questionText: 'HABAGAT SCENARIO: It raining heavily and your mom asked you to buy noodles. What would you prepare?',
      choices: [
        { text: 'Prepare rain gear and waterproof bags', correct: true, explanation: 'Protects from heavy rainfall and keeps items dry.' },
        { text: 'Prepare makeup for the trip', correct: false, explanation: 'Cosmetics are not essential for weather protection.' },
        { text: 'Clean drainage around the house first', correct: true, explanation: 'Prevents flooding and helps community drainage.' },
        { text: 'Let your mom buy the noodles instead', correct: false, explanation: 'Avoiding responsibility during family needs.' }
      ]
    },
    {
      id: 3,
      phenomenonId: 3,
      questionText: 'THUNDERSTORM SCENARIO: A severe thunderstorm is approaching with frequent lightning. What should you do?',
      choices: [
        { text: 'Unplug appliances and electronic devices', correct: true, explanation: 'Protects from power surges and electrical damage.' },
        { text: 'Apply face powder to stay fresh', correct: false, explanation: 'Personal grooming is irrelevant during electrical storms.' },
        { text: 'Watch TV to monitor the weather', correct: false, explanation: 'Using electronics during lightning storm is dangerous.' },
        { text: 'Upload TikTok video of the storm', correct: false, explanation: 'Risking safety for social media content.' }
      ]
    },
    {
      id: 4,
      phenomenonId: 4,
      questionText: 'EL NIÑO DROUGHT SCENARIO: Water supply is limited due to El Niño. What actions should you take?',
      choices: [
        { text: 'Conserve water and fix leaks', correct: true, explanation: 'Essential water management during shortages.' },
        { text: 'Wear jacket despite the heat', correct: false, explanation: 'Inappropriate clothing choice for hot weather.' },
        { text: 'Continue normal water usage', correct: false, explanation: 'Wasteful during water scarcity period.' },
        { text: 'Complain about the heat online', correct: false, explanation: 'Non-productive response to climate situation.' }
      ]
    },
    {
      id: 5,
      phenomenonId: 5,
      questionText: 'AMIHAN SCENARIO: The cool Amihan season has arrived. How should you prepare?',
      choices: [
        { text: 'Wear warm clothing and layers', correct: true, explanation: 'Appropriate for cooler temperatures and comfort.' },
        { text: 'Drink ice-cold beverages only', correct: false, explanation: 'Uncomfortable and potentially unhealthy in cool weather.' },
        { text: 'Eat ice cream frequently', correct: false, explanation: 'May cause discomfort in cooler temperatures.' },
        { text: 'Ignore the temperature change', correct: false, explanation: 'Fails to adapt to seasonal conditions.' }
      ]
    }
  ],

  mapRegions: [
    { id: 'eastern-seaboard', name: 'Eastern Seaboard', coordinates: { x: 75, y: 45 }, color: '#4A90E2' },
    { id: 'western-luzon', name: 'Western Luzon/Visayas', coordinates: { x: 25, y: 35 }, color: '#7ED321' },
    { id: 'metro-manila', name: 'Metro Manila', coordinates: { x: 40, y: 30 }, color: '#9013FE' },
    { id: 'central-luzon', name: 'Central Luzon/Mindanao', coordinates: { x: 45, y: 50 }, color: '#F5A623' },
    { id: 'northern-luzon', name: 'Northern Luzon', coordinates: { x: 45, y: 15 }, color: '#50E3C2' }
  ]
};

// Helper functions
export const getPhenomenonById = (id) => {
  return game2Data.phenomena.find(phenomenon => phenomenon.id === id);
};

export const getScenariosForPhenomenon = (phenomenonId) => {
  return game2Data.scenarios.filter(scenario => scenario.phenomenonId === phenomenonId);
};

export const getRegionByName = (regionName) => {
  return game2Data.mapRegions.find(region => region.name === regionName);
};