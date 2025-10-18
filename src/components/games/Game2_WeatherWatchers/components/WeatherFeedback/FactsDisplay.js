import React from 'react';
import './WeatherFeedback.css';

const FactsDisplay = ({ facts, phenomenon }) => {
  return (
    <div className="facts-display">
      <div className="facts-header">
        <span className="facts-icon">📚</span>
        <h3>Weather Facts: {phenomenon.name}</h3>
      </div>
      <div className="facts-content">
        <p>{facts}</p>
      </div>
    </div>
  );
};

export default FactsDisplay;