// ScenarioCard.js
import React from 'react';
import './SeasonalTeleportationQuiz.css';

const ScenarioCard = ({ 
  scenario
}) => {
  // Function to get season-specific icon
  const getSeasonIcon = (season) => {
    const seasonLower = season?.toLowerCase() || '';
    if (seasonLower.includes('spring')) return '🌸';
    if (seasonLower.includes('summer')) return '☀️';
    if (seasonLower.includes('autumn') || seasonLower.includes('fall')) return '🍂';
    if (seasonLower.includes('winter')) return '❄️';
    return '🌍';
  };

  return (
    <div className="scenario-card">
      <div className="scenario-question-container">
        <h3 className="scenario-question">{scenario.question}</h3>
      </div>

      {scenario.hint && (
        <div className="scenario-hint">
          <span className="hint-icon">💫</span>
          <span className="hint-text">{scenario.hint}</span>
        </div>
      )}

      <div className="scenario-image">
        <div className="image-overlay">
          <span className="overlay-text">Navigation Waypoint</span>
          <span className="overlay-icon">🗺️</span>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;