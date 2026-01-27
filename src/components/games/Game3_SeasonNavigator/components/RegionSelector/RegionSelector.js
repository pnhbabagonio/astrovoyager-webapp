import React, { useState } from 'react';
import './RegionSelector.css';

const RegionSelector = ({ regions, completedRegions, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (region) => {
    setSelectedId(region.id);
    setTimeout(() => onSelect(region), 500);
  };

  return (
    <div className="region-selector">
      {/* <div className="selector-header">
        <h2>🔭 Telescope Targeting System</h2>
        <p className="subtitle">Select a celestial region to observe seasonal patterns</p>
        {completedRegions.length > 0 && (
          <div className="completion-banner">
            <span className="banner-icon">✅</span>
            <span>Chart Complete: {completedRegions.length} region(s)</span>
          </div>
        )}
      </div> */}
      
      <div className="star-chart-container">
        <div className="regions-grid">
          {regions.map(region => {
            const isCompleted = completedRegions.includes(region.id);
            const seasonClass = region.currentSeason.toLowerCase();
            
            return (
              <div 
                key={region.id}
                className={`telescope-target-card ${seasonClass} ${selectedId === region.id ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleSelect(region)}
              >
                {isCompleted && (
                  <div className="celestial-badge">
                    <span className="badge-icon">★</span>
                    <span className="badge-text">Mapped</span>
                  </div>
                )}
                
                <div className="region-icon">{region.icon}</div>
                <h3>{region.name}</h3>
                <p className="region-description">{region.description}</p>
                
                <div className="target-coordinates">
                  <span className="coordinate-label">Coordinates:</span>
                  <span className="coordinate-value">{region.coordinates || '40.7128° N, 74.0060° W'}</span>
                </div>
                
                <div className="season-stars">
                  <span className="star-pattern-label">Visible Constellations:</span>
                  <div className="star-pattern-tags">
                    {region.availableSeasons.map((season, index) => (
                      <span key={index} className="star-pattern-tag">{season}</span>
                    ))}
                  </div>
                </div>
                
                <div className="current-season">
                  <span className="current-label">Current Phase:</span>
                  <span className="current-value">{region.currentSeason}</span>
                </div>
                
                <div className="scan-progress">
                  {selectedId === region.id ? '🔭 FOCUS ACQUIRED' : 
                   isCompleted ? '📡 RE-OBSERVE' : '👁️ OBSERVE NOW'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="observatory-instructions">
        <p>Focus your telescope on different celestial regions to study seasonal patterns!</p>
        {completedRegions.length > 0 && (
          <p className="encouragement">
            <span className="encouragement-icon">🎯</span>
            Map all {regions.length} regions to complete your celestial atlas!
          </p>
        )}
      </div>
    </div>
  );
};

export default RegionSelector;