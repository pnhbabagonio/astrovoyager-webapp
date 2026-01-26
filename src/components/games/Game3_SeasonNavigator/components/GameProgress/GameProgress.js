// GameProgress.js
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
    { number: 1, label: 'Planet Selection', icon: '🪐' },
    { number: 2, label: 'Astronaut Log', icon: '📝' },
    { number: 3, label: 'Wormhole Navigation', icon: '🌌' },
    { number: 4, label: 'Stellar Observation', icon: '🔭' }
  ];

  return (
    <div className="game-progress">
      {/* Mission Timeline - Now horizontal */}
      <div className="progress-section">
        <h3 className="section-title">Mission Timeline</h3>
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
                <div className="completion-status"></div>
              </div>
              <div className="step-info">
                <span className="step-label">Phase {step.number}</span>
                <span className="step-name">{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Status */}
      <div className="stats-section">
        <h3 className="section-title">Mission Status</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <span className="stat-label">Current Planet</span>
              <span className="stat-value">
                {selectedRegion?.name || 'Selecting...'}
              </span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-label">Mission Score</span>
              <span className="stat-value">{score} points</span>
            </div>
          </div>
          
          {completedRegions.length > 0 && (
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Planets Explored</span>
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