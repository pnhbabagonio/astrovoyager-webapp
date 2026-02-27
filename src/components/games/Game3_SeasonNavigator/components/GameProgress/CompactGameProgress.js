import React from 'react';

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
      {/* Phase Steps */}
      <div className="phase-steps">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className={`phase-step 
              ${step.number === currentStep ? 'active' : ''} 
              ${step.number < currentStep ? 'completed' : ''}`}
          >
            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{step.label}</span>
            {index < steps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactGameProgress;