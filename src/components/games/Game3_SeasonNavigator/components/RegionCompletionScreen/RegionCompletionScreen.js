import React from 'react';
import './RegionCompletionScreen.css';

const RegionCompletionScreen = ({ 
  region, 
  regionScore, 
  isReplay,
  completedRegions,
  totalRegions,
  onContinue,
  onReplay,
  onExit 
}) => {
  return (
    <div className="region-completion-screen">
      <div className="completion-card">
        <div className="completion-header">
          <div className="region-icon-large">{region.icon}</div>
          <h2>{isReplay ? 'Region Replay Complete!' : 'Region Exploration Complete!'}</h2>
          <p className="region-name">{region.name}</p>
        </div>
        
        <div className="completion-body">
          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{regionScore}</span>
              <span className="score-label">points</span>
            </div>
            <div className="score-details">
              <span className="score-message">
                {regionScore >= 120 ? 'Outstanding! 🌟' : 
                 regionScore >= 90 ? 'Great Job! 👍' : 
                 regionScore >= 60 ? 'Good Work! ✅' : 
                 'Keep Learning! 📚'}
              </span>
            </div>
          </div>
          
          <div className="progress-indicator">
            <h4>Global Progress</h4>
            <div className="regions-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedRegions.length / totalRegions) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {completedRegions.length} of {totalRegions} regions explored
              </span>
            </div>
            
            <div className="region-tags">
              {completedRegions.map((regionId, index) => (
                <span key={index} className="region-tag completed">
                  ✓ {regionId}
                </span>
              ))}
            </div>
          </div>
          
          <div className="completion-actions">
            {completedRegions.length < totalRegions ? (
              <>
                <button onClick={onContinue} className="action-button primary">
                  <span className="button-icon">🌎</span>
                  Explore Next Region
                </button>
                <button onClick={onReplay} className="action-button secondary">
                  <span className="button-icon">🔄</span>
                  Replay This Region
                </button>
              </>
            ) : (
              <button onClick={onContinue} className="action-button primary">
                <span className="button-icon">🏆</span>
                View Final Results
              </button>
            )}
            <button onClick={onExit} className="action-button exit">
              <span className="button-icon">🗺️</span>
              Return to Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionCompletionScreen;