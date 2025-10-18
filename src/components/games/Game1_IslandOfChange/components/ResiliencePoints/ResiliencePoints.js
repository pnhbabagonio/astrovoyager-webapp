import React from 'react';
import './ResiliencePoints.css';

const ResiliencePoints = ({ points }) => {
  return (
    <div className="resilience-points">
      <div className="points-icon">🛡️</div>
      <div className="points-info">
        <div className="points-label">Community Resilience</div>
        <div className="points-value">{points} points</div>
      </div>
    </div>
  );
};

export default ResiliencePoints;