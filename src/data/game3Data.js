export const game3Data = {
  seasons: [
    {
      id: 1,
      name: 'Wet Season',
      description: 'Characterized by heavy rainfall and frequent typhoons',
      months: 'June to September',
      sunArc: 'high',
      backgroundImage: 'wet-season.jpg',
      typicalWeather: 'Heavy rainfall, thunderstorms, and occasional typhoons. High humidity and overcast skies are common.',
      explanation: 'During the wet season, the sun is high in the sky (near the Tropic of Cancer) because the Earth axial tilt exposes the Northern Hemisphere to more direct sunlight. This increased solar energy fuels the evaporation that leads to heavy rainfall in the Philippines.',
      color: '#4A90E2'
    },
    {
      id: 2,
      name: 'Dry Season',
      description: 'Characterized by hot, dry weather with minimal rainfall',
      months: 'December to February',
      sunArc: 'low',
      backgroundImage: 'dry-season.jpg',
      typicalWeather: 'Hot, dry days with clear skies. Cooler nights and minimal rainfall. Perfect for outdoor activities.',
      explanation: 'In the dry season, the sun is lower in the sky (near the Tropic of Capricorn) as the Southern Hemisphere receives more direct sunlight. The Philippines experiences less solar energy, resulting in cooler temperatures and reduced rainfall.',
      color: '#F5A623'
    },
    {
      id: 3,
      name: 'Transition Season',
      description: 'Period between wet and dry seasons with variable weather',
      months: 'March to May & October to November',
      sunArc: 'medium',
      backgroundImage: 'transition-season.jpg',
      typicalWeather: 'Variable weather patterns. Hot days with occasional thunderstorms. Gradual changes between dry and wet conditions.',
      explanation: 'During transition seasons, the sun follows a medium arc (near the Equator) as the Earth moves between solstices. This creates balanced solar exposure, leading to moderate temperatures and unpredictable weather patterns in the Philippines.',
      color: '#7ED321'
    }
  ],

  quickActions: [
    // Wet Season Actions
    {
      id: 1,
      seasonId: 1,
      actionText: 'Close umbrella when not in use',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Umbrellas should be ready during wet season as rain can start suddenly.'
    },
    {
      id: 2,
      seasonId: 1,
      actionText: 'Clean drainage systems',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Prevents flooding and ensures proper water flow during heavy rains.'
    },
    {
      id: 3,
      seasonId: 1,
      actionText: 'Store emergency supplies',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Essential for typhoon preparedness and power outages.'
    },
    {
      id: 4,
      seasonId: 1,
      actionText: 'Wear light, waterproof clothing',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Comfortable and practical for humid, rainy conditions.'
    },
    {
      id: 5,
      seasonId: 1,
      actionText: 'Plan outdoor picnics',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Outdoor activities are often disrupted by sudden rainfall.'
    },

    // Dry Season Actions
    {
      id: 6,
      seasonId: 2,
      actionText: 'Water plants early morning',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Reduces water evaporation and helps plants survive dry conditions.'
    },
    {
      id: 7,
      seasonId: 2,
      actionText: 'Wear heavy jackets',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Light, breathable clothing is more suitable for hot weather.'
    },
    {
      id: 8,
      seasonId: 2,
      actionText: 'Conserve water usage',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Important during water scarcity in drought conditions.'
    },
    {
      id: 9,
      seasonId: 2,
      actionText: 'Use sun protection',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Protects from strong UV rays during sunny days.'
    },
    {
      id: 10,
      seasonId: 2,
      actionText: 'Leave taps running',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Wastes precious water resources during dry periods.'
    },

    // Transition Season Actions
    {
      id: 11,
      seasonId: 3,
      actionText: 'Drink hot coffee frequently',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Cool beverages are often more refreshing in warm weather.'
    },
    {
      id: 12,
      seasonId: 3,
      actionText: 'Drink ice tea for hydration',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Helps maintain hydration in variable temperatures.'
    },
    {
      id: 13,
      seasonId: 3,
      actionText: 'Carry both umbrella and sunglasses',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Prepares for sudden weather changes between sun and rain.'
    },
    {
      id: 14,
      seasonId: 3,
      actionText: 'Wear layered clothing',
      isCorrect: true,
      timeLimit: 5,
      explanation: 'Allows adjustment to changing temperatures throughout the day.'
    },
    {
      id: 15,
      seasonId: 3,
      actionText: 'Plan rigid outdoor schedules',
      isCorrect: false,
      timeLimit: 5,
      explanation: 'Weather can be unpredictable during transition seasons.'
    }
  ],

  months: [
    { id: 1, name: 'January', seasonId: 2 },
    { id: 2, name: 'February', seasonId: 2 },
    { id: 3, name: 'March', seasonId: 3 },
    { id: 4, name: 'April', seasonId: 3 },
    { id: 5, name: 'May', seasonId: 3 },
    { id: 6, name: 'June', seasonId: 1 },
    { id: 7, name: 'July', seasonId: 1 },
    { id: 8, name: 'August', seasonId: 1 },
    { id: 9, name: 'September', seasonId: 1 },
    { id: 10, name: 'October', seasonId: 3 },
    { id: 11, name: 'November', seasonId: 3 },
    { id: 12, name: 'December', seasonId: 2 }
  ]
};

// Helper functions
export const getSeasonById = (seasonId) => {
  return game3Data.seasons.find(season => season.id === seasonId);
};

export const getQuickActionsForSeason = (seasonId) => {
  return game3Data.quickActions.filter(action => action.seasonId === seasonId);
};

export const getMonthById = (monthId) => {
  return game3Data.months.find(month => month.id === monthId);
};

export const getRandomMonthForSeason = (seasonId) => {
  const seasonMonths = game3Data.months.filter(month => month.seasonId === seasonId);
  const randomIndex = Math.floor(Math.random() * seasonMonths.length);
  return seasonMonths[randomIndex];
};

export const getSunArcPosition = (arcType) => {
  const positions = {
    high: { top: '20%', left: '50%' },
    medium: { top: '50%', left: '50%' },
    low: { top: '80%', left: '50%' }
  };
  return positions[arcType] || positions.medium;
};