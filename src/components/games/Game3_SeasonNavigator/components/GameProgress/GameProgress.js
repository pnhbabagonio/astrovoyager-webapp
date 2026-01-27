import React from 'react';
import './GameProgress.css';

const GameProgress = ({ currentStep, totalSteps, selectedRegion, score }) => {
  const steps = [
    { number: 1, name: 'Region Selection', icon: '🌍' },
    { number: 2, name: 'Fill-in-Blanks', icon: '📝' },
    { number: 3, name: 'Teleportation Quiz', icon: '🚀' },
    { number: 4, name: 'Observational Check', icon: '🤔' }
  ];

  return (
    <div className="game-progress">
      <div className="progress-steps-container">
        <div className="progress-line-bg"></div>
        <div 
          className="progress-line-fill" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="progress-steps">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`step ${step.number === currentStep ? 'active' : ''} ${
                step.number < currentStep ? 'completed' : ''
              }`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-info">
                <div className="step-name">{step.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-info">
        <div className="info-item">
          <span className="label">Selected Region:</span>
          <span>   </span>
          <span className="value">{selectedRegion?.name || 'None'}</span>
        </div>
        <div className="info-item">
          <span className="label">Current Score:</span>
          <span>   </span>
          <span className="value">{score} points</span>
        </div>
      </div>
    </div>
  );
};
export default GameProgress;