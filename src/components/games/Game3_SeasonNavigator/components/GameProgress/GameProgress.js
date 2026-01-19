import React from 'react';
import './GameProgress.css';

const GameProgress = ({ 
  currentStep, 
  totalSteps = 4, 
  selectedRegion, 
  score,
  completedRegions = []
}) => {
  const steps = [
    { number: 1, label: 'Region Selection', icon: '🌍' },
    { number: 2, label: 'Fill-in-Blanks', icon: '📝' },
    { number: 3, label: 'Teleportation Quiz', icon: '🚀' },
    { number: 4, label: 'Observational Check', icon: '🤔' }
  ];

  return (
    <div className="game-progress">
      {/* Progress Steps Section */}
      <div className="progress-section">
        <h3 className="section-title">Game Progress</h3>
        <div className="steps-container">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`step-item 
                ${step.number === currentStep ? 'active' : ''} 
                ${step.number < currentStep ? 'completed' : ''}`}
            >
              <div className="step-circle">
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">{step.number}</span>
              </div>
              <div className="step-info">
                <span className="step-label">Step {step.number}</span>
                <span className="step-name">{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h3 className="section-title">Current Status</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <span className="stat-label">Selected Region</span>
              <span className="stat-value">
                {selectedRegion?.name || 'None Selected'}
              </span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-label">Current Score</span>
              <span className="stat-value">{score} points</span>
            </div>
          </div>
          
          {completedRegions.length > 0 && (
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Regions Completed</span>
                <span className="stat-value">
                  {completedRegions.length}/3
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameProgress;