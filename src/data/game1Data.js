export const game1Data = {
  roles: [
    {
      id: 1,
      name: 'Farmer',
      description: 'Concerned about crops and weather',
      icon: '🌾',
      color: '#8BC34A',
      specialty: 'Agriculture and crop protection'
    },
    {
      id: 2,
      name: 'Doctor',
      description: 'Focused on community health during disasters',
      icon: '⚕️',
      color: '#F44336',
      specialty: 'Community health and emergency medicine'
    },
    {
      id: 3,
      name: 'Rescuer',
      description: 'Responds to typhoons and volcanic eruptions',
      icon: '🚑',
      color: '#FF9800',
      specialty: 'Emergency response and evacuation'
    }
  ],

  scenarios: [
    {
      id: 1,
      title: 'TYPHOON ALERT!!!!',
      description: 'Philippines position along the Pacific Ocean, strong typhoon hits often. A powerful typhoon is approaching your community with winds up to 180 km/h.',
      disasterType: 'typhoon',
      voiceOverFile: 'typhoon-alert.mp3',
      geographyExplanation: 'The Philippines is located along the Pacific Ocean where typhoons frequently form and gain strength before making landfall. Its archipelagic nature makes coastal communities particularly vulnerable to storm surges and flooding.',
      backgroundImage: 'typhoon-bg.jpg'
    },
    {
      id: 2,
      title: 'VOLCANIC ERUPTION!!!!',
      description: 'Philippines located in the Pacific Ring of Fire, making eruptions frequent. Mount Mayon is showing signs of imminent eruption with ash plumes and earthquakes.',
      disasterType: 'volcanic',
      voiceOverFile: 'volcanic-eruption.mp3',
      geographyExplanation: 'The Philippines is part of the Pacific Ring of Fire, a region with high volcanic and seismic activity. This geological setting makes volcanic eruptions common, affecting air quality, agriculture, and community safety.',
      backgroundImage: 'volcanic-bg.jpg'
    },
    {
      id: 3,
      title: 'EL NIÑO DROUGHT!!!!',
      description: 'Philippines equatorial location affects rainfall patterns, causing droughts. A severe El Niño event has caused months of drought, threatening water supply and agriculture.',
      disasterType: 'drought',
      voiceOverFile: 'el-nino.mp3',
      geographyExplanation: 'The Philippines equatorial location makes it susceptible to El Niño events, which alter rainfall patterns and can cause prolonged droughts. This affects agriculture, water resources, and community health.',
      backgroundImage: 'drought-bg.jpg'
    }
  ],

  choices: [
    // Typhoon Scenario Choices
    {
      id: 1,
      scenarioId: 1,
      roleId: 1, // Farmer
      choiceText: 'Harvest crops early before the storm',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Excellent! Early harvest saved most crops from destruction.',
      feedback: 'You protected the community food supply by acting proactively.'
    },
    {
      id: 2,
      scenarioId: 1,
      roleId: 1, // Farmer
      choiceText: 'Build windbreaks with bamboo/trees',
      isCorrect: true,
      resiliencePoints: 8,
      consequenceText: 'Good decision! Windbreaks minimized crop damage.',
      feedback: 'Natural barriers help protect against strong winds.'
    },
    {
      id: 3,
      scenarioId: 1,
      roleId: 1, // Farmer
      choiceText: 'Wait and see what happens',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'OH, NO! THE CROPS DIED! YOU FAILED, TRY AGAIN?',
      feedback: 'Proactive measures are essential when typhoons approach.'
    },
    {
      id: 4,
      scenarioId: 1,
      roleId: 2, // Doctor
      choiceText: 'Prepare first aid kits',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Well done! Medical supplies are ready for emergencies.',
      feedback: 'First aid readiness saves lives during disasters.'
    },
    {
      id: 5,
      scenarioId: 1,
      roleId: 2, // Doctor
      choiceText: 'Set up emergency health stations',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Excellent! Health stations are prepared for casualties.',
      feedback: 'Emergency medical infrastructure is crucial.'
    },
    {
      id: 6,
      scenarioId: 1,
      roleId: 2, // Doctor
      choiceText: 'Spread information on avoiding waterborne diseases',
      isCorrect: true,
      resiliencePoints: 7,
      consequenceText: 'Good thinking! Community health awareness prevented outbreaks.',
      feedback: 'Preventive health measures reduce post-disaster illnesses.'
    },
    {
      id: 7,
      scenarioId: 1,
      roleId: 3, // Rescuer
      choiceText: 'Clear drainage system to prevent flooding',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Great work! Proper drainage minimized flood damage.',
      feedback: 'Flood prevention protects infrastructure and lives.'
    },
    {
      id: 8,
      scenarioId: 1,
      roleId: 3, // Rescuer
      choiceText: 'Orient community on evacuation drills',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Excellent! Evacuation drills saved many lives.',
      feedback: 'Prepared communities respond better to emergencies.'
    },
    {
      id: 9,
      scenarioId: 1,
      roleId: 3, // Rescuer
      choiceText: 'Prepare boats and life vests',
      isCorrect: true,
      resiliencePoints: 8,
      consequenceText: 'Good preparation! Rescue equipment is ready.',
      feedback: 'Proper equipment enables effective emergency response.'
    },

    // Volcanic Eruption Scenario Choices
    {
      id: 10,
      scenarioId: 2,
      roleId: 1, // Farmer
      choiceText: 'Move animals away from ashfall',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Well done! Livestock was protected from harmful ash.',
      feedback: 'Animal welfare is crucial during volcanic events.'
    },
    {
      id: 11,
      scenarioId: 2,
      roleId: 1, // Farmer
      choiceText: 'Cover crops with tarpaulins',
      isCorrect: true,
      resiliencePoints: 8,
      consequenceText: 'Good thinking! Crop protection maintained food supply.',
      feedback: 'Ashfall protection preserves agricultural productivity.'
    },
    {
      id: 12,
      scenarioId: 2,
      roleId: 1, // Farmer
      choiceText: 'Continue normal farming activities',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Crops destroyed by ashfall! Community faces food shortage.',
      feedback: 'Volcanic ash requires immediate protective measures.'
    },
    {
      id: 13,
      scenarioId: 2,
      roleId: 2, // Doctor
      choiceText: 'Distribute face masks and goggles',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Excellent! Respiratory protection prevented health issues.',
      feedback: 'Air quality protection is vital during eruptions.'
    },
    {
      id: 14,
      scenarioId: 2,
      roleId: 2, // Doctor
      choiceText: 'Establish clean water checkpoints',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Great work! Water safety prevented contamination.',
      feedback: 'Clean water access prevents waterborne diseases.'
    },
    {
      id: 15,
      scenarioId: 2,
      roleId: 2, // Doctor
      choiceText: 'Wait for official health advisories',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Community suffered from respiratory illnesses!',
      feedback: 'Proactive health measures are essential.'
    },
    {
      id: 16,
      scenarioId: 2,
      roleId: 3, // Rescuer
      choiceText: 'Lead evacuation to safe zones',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Excellent! Timely evacuation saved lives.',
      feedback: 'Organized evacuation prevents casualties.'
    },
    {
      id: 17,
      scenarioId: 2,
      roleId: 3, // Rescuer
      choiceText: 'Assist in search and rescue in lahar areas',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Brave work! Rescue operations successful.',
      feedback: 'Specialized rescue skills save lives in danger zones.'
    },
    {
      id: 18,
      scenarioId: 2,
      roleId: 3, // Rescuer
      choiceText: 'Focus only on urban areas',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Rural communities were not evacuated in time!',
      feedback: 'Comprehensive evacuation planning includes all areas.'
    },

    // Drought Scenario Choices
    {
      id: 19,
      scenarioId: 3,
      roleId: 1, // Farmer
      choiceText: 'Rotate crops to conserve soil nutrients',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Smart farming! Soil conservation maintained productivity.',
      feedback: 'Sustainable practices help during water scarcity.'
    },
    {
      id: 20,
      scenarioId: 3,
      roleId: 1, // Farmer
      choiceText: 'Practice water-saving irrigation',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Excellent! Efficient water use sustained crops.',
      feedback: 'Water conservation is key during droughts.'
    },
    {
      id: 21,
      scenarioId: 3,
      roleId: 1, // Farmer
      choiceText: 'Plant water-intensive crops as usual',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Crops failed due to water shortage!',
      feedback: 'Adapt farming practices to water availability.'
    },
    {
      id: 22,
      scenarioId: 3,
      roleId: 2, // Doctor
      choiceText: 'Educate about dehydration and heatstroke prevention',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Great health education! Community avoided heat-related illnesses.',
      feedback: 'Preventive health education saves lives.'
    },
    {
      id: 23,
      scenarioId: 3,
      roleId: 2, // Doctor
      choiceText: 'Monitor malnutrition from reduced harvests',
      isCorrect: true,
      resiliencePoints: 8,
      consequenceText: 'Good monitoring! Early detection prevented severe malnutrition.',
      feedback: 'Nutrition monitoring is crucial during food scarcity.'
    },
    {
      id: 24,
      scenarioId: 3,
      roleId: 2, // Doctor
      choiceText: 'Focus only on treating existing patients',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Community health deteriorated due to lack of prevention!',
      feedback: 'Proactive community health measures are essential.'
    },
    {
      id: 25,
      scenarioId: 3,
      roleId: 3, // Rescuer
      choiceText: 'Distribute water rations fairly',
      isCorrect: true,
      resiliencePoints: 10,
      consequenceText: 'Excellent! Fair distribution maintained community stability.',
      feedback: 'Equitable resource distribution prevents conflicts.'
    },
    {
      id: 26,
      scenarioId: 3,
      roleId: 3, // Rescuer
      choiceText: 'Protect forests from fire outbreaks',
      isCorrect: true,
      resiliencePoints: 9,
      consequenceText: 'Great prevention! Forest fires were avoided.',
      feedback: 'Fire prevention protects ecosystems and communities.'
    },
    {
      id: 27,
      scenarioId: 3,
      roleId: 3, // Rescuer
      choiceText: 'Wait for government assistance only',
      isCorrect: false,
      resiliencePoints: 0,
      consequenceText: 'Community suffered from water and food shortages!',
      feedback: 'Local initiative is crucial during emergencies.'
    }
  ]
};

// Helper functions
export const getChoicesForScenarioAndRole = (scenarioId, roleId) => {
  return game1Data.choices.filter(choice => 
    choice.scenarioId === scenarioId && choice.roleId === roleId
  );
};

export const getScenarioById = (scenarioId) => {
  return game1Data.scenarios.find(scenario => scenario.id === scenarioId);
};

export const getRoleById = (roleId) => {
  return game1Data.roles.find(role => role.id === roleId);
};