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
  const seasonClass = region.currentSeason.toLowerCase();
  
  return (
    <div className={`region-completion-screen ${seasonClass}-discovery`}>
      <div className="celestial-discovery-card">
        <div className="discovery-header">
          <div className="constellation-icon-large">{region.icon}</div>
          <h2>{isReplay ? 'Re-observation Complete!' : 'Discovery Complete!'}</h2>
          <p className="celestial-region">{region.name}</p>
        </div>
        
        <div className="discovery-analysis">
          <div className="stellar-energy-reading">
            <div className="energy-sphere">
              <span className="energy-value">{regionScore}</span>
              <span className="energy-label">energy units</span>
            </div>
            <div className="discovery-assessment">
              <span className="discovery-message">
                {regionScore >= 120 ? '🌟 Stellar Observation!' : 
                 regionScore >= 90 ? '📡 Excellent Analysis!' : 
                 regionScore >= 60 ? '✅ Valid Data Collected!' : 
                 '🔭 Further Observation Needed'}
              </span>
            </div>
          </div>
          
          <div className="observatory-progress">
            <h4>Observatory Progress</h4>
            <div className="sky-mapping-progress">
              <div className="progress-orbit">
                <div 
                  className="progress-satellite"
                  style={{ width: `${(completedRegions.length / totalRegions) * 100}%` }}
                />
              </div>
              <span className="progress-status">
                {completedRegions.length} of {totalRegions} constellations mapped
              </span>
            </div>
            
            <div className="constellation-tags">
              {completedRegions.map((regionId, index) => (
                <span key={index} className="constellation-tag mapped">
                  {regionId}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mission-operations">
            {completedRegions.length < totalRegions ? (
              <>
                <button onClick={onContinue} className="operation-button primary">
                  <span className="operation-icon">🌌</span>
                  Chart Next Constellation
                </button>
                <button onClick={onReplay} className="operation-button secondary">
                  <span className="operation-icon">🔄</span>
                  Re-observe This Region
                </button>
              </>
            ) : (
              <button onClick={onContinue} className="operation-button primary">
                <span className="operation-icon">🏆</span>
                View Mission Results
              </button>
            )}
            <button onClick={onExit} className="operation-button exit">
              <span className="operation-icon">🗺️</span>
              Return to Control Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionCompletionScreen;