import React from 'react';
import './PreparednessPoints.css';

const PreparednessPoints = ({ points }) => {
  return (
    <div className="preparedness-points">
      <div className="points-icon">🌦️</div>
      <div className="points-info">
        <div className="points-label">Preparedness Score</div>
        <div className="points-value">{points} points</div>
      </div>
    </div>
  );
};

export default PreparednessPoints;