import React from 'react';
import './SeasonMatcher.css';

const SeasonBackground = ({ season }) => {
  const getSeasonImage = (seasonName) => {
    // These would be actual image paths in production
    const images = {
      'Wet Season': 'linear-gradient(135deg, #87CEEB, #4682B4)',
      'Dry Season': 'linear-gradient(135deg, #FFD700, #FF8C00)',
      'Transition Season': 'linear-gradient(135deg, #98FB98, #32CD32)'
    };
    return images[season.name] || images['Transition Season'];
  };

  return (
    <div 
      className="season-background"
      style={{ background: getSeasonImage(season.name) }}
    >
      <div className="weather-effects">
        {season.name === 'Wet Season' && (
          <>
            <div className="rain-drop"></div>
            <div className="rain-drop"></div>
            <div className="rain-drop"></div>
          </>
        )}
        {season.name === 'Dry Season' && (
          <div className="sun-rays"></div>
        )}
        {season.name === 'Transition Season' && (
          <div className="clouds"></div>
        )}
      </div>
    </div>
  );
};

export default SeasonBackground;