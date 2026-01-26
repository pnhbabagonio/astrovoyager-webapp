// RegionSelector.js - Updated with space theme
import React, { useState } from 'react';
import './RegionSelector.css';

const RegionSelector = ({ regions, completedRegions, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelect = (region) => {
    setSelectedId(region.id);
    
    // Create teleport effect
    createTeleportEffect(region);
    
    setTimeout(() => onSelect(region), 500);
  };

  const createTeleportEffect = (region) => {
    const colors = region.id.includes('north') ? ['#00f7ff', '#4caf50'] :
                   region.id.includes('south') ? ['#ff5252', '#ff8e53'] :
                   ['#ffd700', '#9d4edd'];
    
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.backgroundColor = colors[i % 2];
        particle.style.boxShadow = `0 0 ${Math.random() * 15 + 5}px currentColor`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.style.transition = 'all 1s ease-out';
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
          }
          
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, 1000);
        }, 50);
      }, i * 40);
    }
  };

  const getSeasonEmojis = (season) => {
    const emojis = {
      'Spring': '🌱🌸🌷',
      'Summer': '☀️🌊🏖️',
      'Autumn': '🍂🍁🎃',
      'Winter': '❄️⛄🎄'
    };
    return emojis[season] || '🌍';
  };

  return (
    <div className="region-selector">
      <div className="selector-header">
        <h2>🪐 Choose Your Exploration Planet</h2>
        <p className="subtitle">Select a planet to begin your seasonal navigation mission</p>
        {completedRegions.length > 0 && (
          <div className="completion-banner">
            <span className="banner-icon">✅</span>
            <span>You've explored {completedRegions.length} planet(s)</span>
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
              onMouseEnter={() => setHoveredId(region.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isCompleted && (
                <div className="completion-badge">
                  <span className="badge-icon">✓</span>
                  <span className="badge-text">Explored</span>
                </div>
              )}
              
              <div className="region-icon">
                {hoveredId === region.id ? '🚀' : getSeasonEmojis(region.currentSeason).charAt(0)}
              </div>
              <h3>{region.name}</h3>
              <p className="region-description">{region.description}</p>
              
              <div className="region-seasons">
                <span className="season-label">Planetary Cycles:</span>
                <div className="season-tags">
                  {region.availableSeasons.map((season, index) => (
                    <span key={index} className="season-tag">
                      {getSeasonEmojis(season)} {season}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="current-season">
                <span className="current-label">Current Cycle:</span>
                <span className="current-value">
                  {getSeasonEmojis(region.currentSeason)} {region.currentSeason}
                </span>
              </div>
              
              <div className="select-indicator">
                {selectedId === region.id ? '✓ Mission Locked' : 
                 isCompleted ? 'Re-explore Planet' : 'Initiate Exploration'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="selector-instructions">
        <p>Each planet has unique seasonal patterns. Explore them all to master galactic seasonal navigation!</p>
        {completedRegions.length > 0 && completedRegions.length < regions.length && (
          <div className="encouragement">
            <span className="encouragement-icon">🎯</span>
            Explore all {regions.length} planets to complete your mission!
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionSelector;