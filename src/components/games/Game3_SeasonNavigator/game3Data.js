export const game3Data = {
  regions: [
    {
      id: 'northern',
      name: 'Northern Hemisphere (Canada)',
      description: 'Experiences distinct four seasons with opposite patterns to Southern Hemisphere',
      availableSeasons: ['Spring', 'Summer', 'Fall', 'Winter'],
      currentSeason: 'Summer',
      icon: '❄️☀️🍂🌸'
    },
    {
      id: 'southern', 
      name: 'Southern Hemisphere (Australia)',
      description: 'Seasons are opposite of Northern Hemisphere - summer in December',
      availableSeasons: ['Spring', 'Summer', 'Fall', 'Winter'],
      currentSeason: 'Winter',
      icon: '🌞❄️🍁🌺'
    },
    {
      id: 'equator',
      name: 'Near the Equator (Philippines)',
      description: 'Consistent sunlight year-round with wet and dry seasons',
      availableSeasons: ['Wet Season', 'Dry Season'],
      currentSeason: 'Wet Season',
      icon: '☀️🌧️🌴🌡️'
    }
  ],
  
  wordBank: {
    correctWords: ["longer", "shorter", "warmer", "cooler", "summer", "winter", "almost the same"],
    distractorWords: ["hotter", "colder", "spring", "fall", "variable", "extreme", "moderate"]
  },
  
  fillInBlanks: [
    {
      id: 1,
      text: "In the Northern Hemisphere, June usually has _____ days and _____ weather.",
      blanks: [1, 2],
      correctAnswers: ["longer", "warmer"],
      points: 10,
      explanation: "June is summer in the Northern Hemisphere, so days are longer and weather is warmer."
    },
    {
      id: 2,
      text: "Near the Equator, sunlight is _____ throughout the year.",
      blanks: [1],
      correctAnswers: ["almost the same"],
      points: 10,
      explanation: "The Equator receives consistent direct sunlight year-round."
    },
    {
      id: 3,
      text: "In the Southern Hemisphere, December is usually _____.",
      blanks: [1],
      correctAnswers: ["summer"],
      points: 10,
      explanation: "December is summer in the Southern Hemisphere due to Earth's tilt."
    },
    {
      id: 4,
      text: "During winter in Canada, days are _____ and weather is _____.",
      blanks: [1, 2],
      correctAnswers: ["shorter", "cooler"],
      points: 10,
      explanation: "Winter has shorter days and cooler temperatures in the Northern Hemisphere."
    }
  ],
  
  quizScenarios: [
    {
      id: 1,
      image: "/game3/placeholder_scenario1.jpg",
      question: "You find yourself in a region where it is June, and the days are long and warm. It is summer where you are. Which hemisphere are you in?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: true },
        { id: 'b', text: "Southern Hemisphere", correct: false },
        { id: 'c', text: "Equator", correct: false }
      ],
      explanation: "June is summer in the Northern Hemisphere because Earth's tilt causes the Northern Hemisphere to face toward the Sun.",
      points: 15
    },
    {
      id: 2,
      image: "/game3/placeholder_scenario2.jpg",
      question: "It is December, and you are in a place with cold weather and short days. Which hemisphere are you most likely in?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: true },
        { id: 'b', text: "Southern Hemisphere", correct: false },
        { id: 'c', text: "Equator", correct: false }
      ],
      explanation: "December is winter in the Northern Hemisphere, which means colder weather and shorter days.",
      points: 15
    },
    {
      id: 3,
      image: "/game3/placeholder_scenario3.jpg",
      question: "You are in a country where it is June. The days are short, and the weather is cool. Which hemisphere are you in?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: false },
        { id: 'b', text: "Southern Hemisphere", correct: true },
        { id: 'c', text: "Equator", correct: false }
      ],
      explanation: "June is winter in the Southern Hemisphere, resulting in shorter days and cooler weather.",
      points: 15
    },
    {
      id: 4,
      image: "/game3/placeholder_scenario4.jpg",
      question: "You have been teleported to a region where the sunlight is nearly the same all year. It is neither very hot nor very cold. Which region is this?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: false },
        { id: 'b', text: "Southern Hemisphere", correct: false },
        { id: 'c', text: "Equator", correct: true }
      ],
      explanation: "Near the Equator, sunlight is consistent throughout the year, leading to stable temperatures.",
      points: 15
    },
    {
      id: 5,
      image: "/game3/placeholder_scenario5.jpg",
      question: "In July, you are in a place where it is winter and the days are shorter. Which hemisphere are you in?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: false },
        { id: 'b', text: "Southern Hemisphere", correct: true },
        { id: 'c', text: "Equator", correct: false }
      ],
      explanation: "July is winter in the Southern Hemisphere, which experiences opposite seasons to the Northern Hemisphere.",
      points: 15
    },
    {
      id: 6,
      image: "/game3/placeholder_scenario6.jpg",
      question: "You're in a location where January is the hottest month of the year. Where are you likely located?",
      options: [
        { id: 'a', text: "Northern Hemisphere", correct: false },
        { id: 'b', text: "Southern Hemisphere", correct: true },
        { id: 'c', text: "Equator", correct: false }
      ],
      explanation: "January is summer in the Southern Hemisphere, making it the hottest month.",
      points: 15
    }
  ],
  
  observationalQuestions: [
    {
      id: 1,
      question: "How does the amount of sunlight affect the seasons in different regions of the Earth?",
      sampleAnswers: [
        "More direct sunlight causes warmer seasons (summer)",
        "Less direct sunlight causes cooler seasons (winter)",
        "Earth's tilt changes which hemisphere receives more sunlight",
        "Sunlight intensity varies with the angle of sunlight"
      ],
      points: 10,
      keywords: ["direct sunlight", "angle", "intensity", "tilt"]
    },
    {
      id: 2,
      question: "Why do places near the Equator experience less change in seasons compared to the Northern and Southern Hemispheres?",
      sampleAnswers: [
        "Consistent direct sunlight year-round",
        "Sun's rays hit almost perpendicular throughout the year",
        "Less variation in day length",
        "Distance from the poles means less tilt effect"
      ],
      points: 10,
      keywords: ["consistent sunlight", "perpendicular rays", "less variation", "near the middle"]
    }
  ]
};