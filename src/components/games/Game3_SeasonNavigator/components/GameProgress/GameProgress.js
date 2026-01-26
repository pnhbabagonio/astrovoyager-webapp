// GameProgress.js
import React from 'react';
import './GameProgress.css';

const GameProgress = ({ 
  currentStep, 
  totalSteps = 8, // Extended to 8 steps for more detailed timeline
  selectedRegion, 
  score,
  completedRegions = [],
  missionStatus = "IN_PROGRESS", // Added mission status
  missionTime = "72:15:30", // Added mission timer
  resources = 85, // Added resources percentage
  difficulty = "MEDIUM" // Added difficulty level
}) => {
  const steps = [
    { number: 1, label: 'Mission Briefing', icon: '📋', status: 'COMPLETED' },
    { number: 2, label: 'Planet Selection', icon: '🪐', status: 'COMPLETED' },
    { number: 3, label: 'Equipment Check', icon: '🔧', status: 'COMPLETED' },
    { number: 4, label: 'Astronaut Log', icon: '📝', status: currentStep === 4 ? 'ACTIVE' : 'UPCOMING' },
    { number: 5, label: 'Wormhole Navigation', icon: '🌌', status: 'UPCOMING' },
    { number: 6, label: 'Stellar Observation', icon: '🔭', status: 'UPCOMING' },
    { number: 7, label: 'Data Analysis', icon: '📊', status: 'UPCOMING' },
    { number: 8, label: 'Mission Report', icon: '🚀', status: 'UPCOMING' }
  ];

  // Determine status based on missionStatus prop
  const getMissionStatusInfo = () => {
    switch(missionStatus) {
      case "COMPLETED":
        return { label: "Mission Completed", color: "#4CAF50", icon: "✅" };
      case "IN_PROGRESS":
        return { label: "Mission In Progress", color: "#00f7ff", icon: "⏳" };
      case "PAUSED":
        return { label: "Mission Paused", color: "#FF9800", icon: "⏸️" };
      case "FAILED":
        return { label: "Mission Failed", color: "#F44336", icon: "❌" };
      default:
        return { label: "Ready to Launch", color: "#9d4edd", icon: "🔄" };
    }
  };

  const missionStatusInfo = getMissionStatusInfo();

  return (
    <div className="game-progress">
      {/* Mission Timeline - Now Extended */}
      <div className="progress-section">
        <h3 className="section-title">Mission Timeline</h3>
        <div className="steps-container">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`step-item 
                ${step.status === 'ACTIVE' ? 'active' : ''} 
                ${step.status === 'COMPLETED' ? 'completed' : ''}
                ${step.status === 'UPCOMING' ? 'upcoming' : ''}`}
            >
              <div className="step-circle">
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">{step.number}</span>
                <div className="completion-status"></div>
              </div>
              <div className="step-info">
                <span className="step-label">Phase {step.number}</span>
                <span className="step-name">{step.label}</span>
                <span className="step-status">{step.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Status - Extended */}
      <div className="stats-section">
        <h3 className="section-title">Mission Status</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: missionStatusInfo.color }}>
              {missionStatusInfo.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">Mission Status</span>
              <span className="stat-value" style={{ color: missionStatusInfo.color }}>
                {missionStatusInfo.label}
              </span>
            </div>
          </div>
          
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
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <span className="stat-label">Mission Time</span>
              <span className="stat-value">{missionTime}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <span className="stat-label">Resources</span>
              <span className="stat-value">{resources}%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-label">Difficulty</span>
              <span className="stat-value">{difficulty}</span>
            </div>
          </div>
          
          {completedRegions.length > 0 && (
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Planets Explored</span>
                <span className="stat-value">
                  {completedRegions.length}/8
                </span>
              </div>
            </div>
          )}
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <span className="stat-label">Progress</span>
              <span className="stat-value">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameProgress;