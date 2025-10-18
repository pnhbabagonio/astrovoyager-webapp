import React from 'react';
import './SeasonalFeedback.css';

const TimeBonus = ({ bonus, totalTime }) => {
  return (
    <div className="time-bonus">
      <div className="bonus-header">
        <span className="bonus-icon">⚡</span>
        <h3>Speed Bonus!</h3>
      </div>
      <div className="bonus-content">
        <p>You completed the challenge with <strong>{totalTime} seconds</strong> remaining!</p>
        <div className="bonus-points">
          +{bonus} Time Bonus Points!
        </div>
      </div>
    </div>
  );
};

export default TimeBonus;