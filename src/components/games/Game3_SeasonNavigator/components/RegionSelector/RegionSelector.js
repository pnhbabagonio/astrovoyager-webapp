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
      <div className="selector-header">
        <h2>🌍 Choose Your Exploration Region</h2>
        <p className="subtitle">Select where to begin your seasonal journey</p>
        {completedRegions.length > 0 && (
          <div className="completion-banner">
            <span className="banner-icon">✅</span>
            <span>You've completed {completedRegions.length} region(s)</span>
          </div>
        )}
      </div>
      
      <div className="regions-grid">
        {regions.map(region => {
          const isCompleted = completedRegions.includes(region.id);
          return (
            <div 
              key={region.id}
              className={`region-card 
                ${selectedId === region.id ? 'selected' : ''}
                ${isCompleted ? 'completed' : ''}
              `}
              onClick={() => handleSelect(region)}
            >
              {isCompleted && (
                <div className="completion-badge">
                  <span className="badge-icon">✓</span>
                  <span className="badge-text">Completed</span>
                </div>
              )}
              
              <div className="region-icon">{region.icon}</div>
              <h3>{region.name}</h3>
              <p className="region-description">{region.description}</p>
              
              <div className="region-seasons">
                <span className="season-label">Available Seasons:</span>
                <div className="season-tags">
                  {region.availableSeasons.map((season, index) => (
                    <span key={index} className="season-tag">{season}</span>
                  ))}
                </div>
              </div>
              
              <div className="current-season">
                <span className="current-label">Current Season:</span>
                <span className="current-value">{region.currentSeason}</span>
              </div>
              
              <div className="select-indicator">
                {selectedId === region.id ? '✓ Selected' : 
                 isCompleted ? 'Play Again' : 'Click to Explore'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="selector-instructions">
        <p>Explore each region to understand different seasonal patterns across the globe!</p>
        {completedRegions.length > 0 && (
          <p className="encouragement">
            <span className="encouragement-icon">🎯</span>
            Complete all {regions.length} regions to master seasonal navigation!
          </p>
        )}
      </div>
    </div>
  );
};

export default RegionSelector;