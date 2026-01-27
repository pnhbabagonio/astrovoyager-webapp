import React from 'react';
// Updated import path to go up two directories
const CompactGameProgress = ({ 
  currentStep, 
  selectedRegion, 
  score,
  completedRegions = [],
  totalRegions = 3
}) => {
  const steps = [
    { number: 1, label: 'Target', icon: '🔭' },
    { number: 2, label: 'Analysis', icon: '📡' },
    { number: 3, label: 'Navigate', icon: '🌌' },
    { number: 4, label: 'Observe', icon: '📝' }
  ];

  return (
    <div className="compact-status-bar">
      {/* Left: Mission Progress */}
      <div className="progress-indicator">
        <div className="progress-label">
          <span>Mission Phase:</span>
          <span className="mission-status-tag">
            {steps[currentStep - 1]?.icon || '🔭'}
            {steps[currentStep - 1]?.label || 'Setup'}
          </span>
        </div>
        <div className="phase-dots">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={`phase-dot 
                ${step.number === currentStep ? 'active' : ''} 
                ${step.number < currentStep ? 'completed' : ''}`}
              title={`Phase ${step.number}: ${step.label}`}
            />
          ))}
        </div>
      </div>

      {/* Right: Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Target</span>
          <span className="stat-value">
            {selectedRegion?.name || 'None'}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Energy</span>
          <span className="stat-value">{score}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Mapped</span>
          <span className="stat-value">
            {completedRegions.length}/{totalRegions}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Phase</span>
          <span className="stat-value">{currentStep}/4</span>
        </div>
      </div>
    </div>
  );
};

export default CompactGameProgress;