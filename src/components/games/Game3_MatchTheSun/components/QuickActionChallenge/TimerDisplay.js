import React from 'react';
import './QuickActionChallenge.css';

const TimerDisplay = ({ timeRemaining, totalTime }) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isWarning = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <div className={`timer-display ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="timer-icon">⏱️</div>
      <div className="timer-text">{timeRemaining}s</div>
      <div className="timer-bar">
        <div 
          className="timer-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TimerDisplay;