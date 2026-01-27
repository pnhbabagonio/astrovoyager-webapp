// game1Data.js
export const game1Data = {
  title: "AstroVoyager - Energy Detectives",
  theme: "space",
  
  characters: [
    { 
      id: 1, 
      name: "June", 
      avatar: `${process.env.PUBLIC_URL}/assets/images/characters/june.png`, 
      description: "Space Explorer who loves investigating cosmic energy" 
    },
    { 
      id: 2, 
      name: "Quincy", 
      avatar: `${process.env.PUBLIC_URL}/assets/images/characters/quincy.png`, 
      description: "Science Detective with keen observation skills" 
    },
    { 
      id: 3, 
      name: "Annie", 
      avatar: `${process.env.PUBLIC_URL}/assets/images/characters/annie.png`, 
      description: "Energy Expert who understands how nature works" 
    },
    { 
      id: 4, 
      name: "Leo", 
      avatar: `${process.env.PUBLIC_URL}/assets/images/characters/leo.png`, 
      description: "Tech Analyst who analyzes energy patterns" 
    }
  ],
  
  scenarios: [
    {
      id: 1,
      title: "The Sun is shining strongly at noon.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-1.png`,
      choices: [
        {
          id: "1a",
          text: "The temperature becomes hotter because the Sun's rays are more direct at noon.",
          isCorrect: true,
          explanation: "This is correct because when the Sun is directly overhead, its energy is concentrated on a smaller area, making the temperature higher."
        },
        {
          id: "1b",
          text: "It becomes cooler because the Sun is farther from Earth at noon.",
          isCorrect: false,
          explanation: "This is wrong because the Sun's distance from Earth does not change during the day; it only appears higher in the sky at noon."
        }
      ]
    },
    {
      id: 2,
      title: "The Sun heats the land more than the sea.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-2.png`,
      choices: [
        {
          id: "2a",
          text: "The sea heats faster because it is always exposed to sunlight.",
          isCorrect: false,
          explanation: "This is wrong because even with sunlight, water warms more slowly than land."
        },
        {
          id: "2b",
          text: "Land heats up faster than water because water absorbs heat more slowly.",
          isCorrect: true,
          explanation: "This is correct because water has a higher heat capacity, so it takes longer to warm up compared to land."
        }
      ]
    },
    {
      id: 3,
      title: "There is less sunlight for many days.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-3.png`,
      choices: [
        {
          id: "3a",
          text: "The temperature may decrease and plants may grow more slowly.",
          isCorrect: true,
          explanation: "This is correct because less sunlight means less heat and less energy for photosynthesis."
        },
        {
          id: "3b",
          text: "The temperature will increase because clouds trap more heat from the Sun.",
          isCorrect: false,
          explanation: "This is wrong because without enough sunlight, there is less heat energy reaching Earth."
        }
      ]
    },
    {
      id: 4,
      title: "The Sun heats water on the surface.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-4.png`,
      choices: [
        {
          id: "4a",
          text: "The water can evaporate and turn into water vapor.",
          isCorrect: true,
          explanation: "This is correct because heat from the Sun gives water enough energy to change from liquid to gas."
        },
        {
          id: "4b",
          text: "The water will freeze because sunlight removes heat.",
          isCorrect: false,
          explanation: "This is wrong because sunlight adds heat, not removes it."
        }
      ]
    },
    {
      id: 5,
      title: "The atmosphere traps some of the Sun's heat.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-5.png`,
      choices: [
        {
          id: "5a",
          text: "This helps keep Earth warm enough for living things to survive.",
          isCorrect: true,
          explanation: "This is correct because trapped heat maintains Earth's temperature at a livable level."
        },
        {
          id: "5b",
          text: "This causes all of the Sun's heat to escape into space.",
          isCorrect: false,
          explanation: "This is wrong because the atmosphere actually prevents too much heat from escaping."
        }
      ]
    },
    {
      id: 6,
      title: "The Sun rises after a rainy night.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-6.png`,
      choices: [
        {
          id: "6a",
          text: "Rainwater will stay forever because the Sun has no effect on water.",
          isCorrect: false,
          explanation: "This is wrong because the Sun plays a major role in drying water through evaporation."
        },
        {
          id: "6b",
          text: "Puddles may dry faster because of heat from the Sun.",
          isCorrect: true,
          explanation: "This is correct because sunlight causes evaporation of water on the ground."
        }
      ]
    },
    {
      id: 7,
      title: "A village spends long hours under strong sunlight.",
      image: `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/scene-7.png`,
      choices: [
        {
          id: "7a",
          text: "People will feel colder because sunlight blocks body heat.",
          isCorrect: false,
          explanation: "This is wrong because sunlight adds heat to the body, not blocks it."
        },
        {
          id: "7b",
          text: "People may feel hotter and need shade or water to stay safe.",
          isCorrect: true,
          explanation: "This is correct because prolonged exposure to sunlight increases body temperature."
        }
      ]
    }
  ],
  
  reflectionQuestions: [
    "What did you notice about how the Sun's energy affects the Earth and living things in the situations you answered?",
    "Which situation showed the strongest effect of the Sun's energy? Why do you think so?",
    "How does the Sun's energy affect your daily life based on the examples in the game?"
  ]
};