import React from 'react';
import './AccuracyPoints.css';

const AccuracyPoints = ({ points, bonuses }) => {
  return (
    <div className="accuracy-points">
      <div className="points-icon">🎯</div>
      <div className="points-info">
        <div className="points-label">Accuracy Score</div>
        <div className="points-value">{points} points</div>
        {bonuses > 0 && (
          <div className="bonus-label">+{bonuses} time bonus</div>
        )}
      </div>
    </div>
  );
};

export default AccuracyPoints;