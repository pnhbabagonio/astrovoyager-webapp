import React from 'react';
import './LocationSelector.css';

const LocationSelector = ({ locations, onSelectLocation, locationProgress }) => {
  const getLocationStatus = (locationId) => {
    const progress = locationProgress[locationId];
    if (progress.completed) {
      return {
        status: 'completed',
        text: `Completed - Score: ${progress.score}/3`,
        color: '#28c896'
      };
    }
    return {
      status: 'available',
      text: 'Available - Click to explore',
      color: '#4a7dff'
    };
  };

  return (
    <div className="location-selector">
      <div className="selector-header">
        <h2>🌍 Choose Your Observation Location</h2>
        <p className="instruction">
          Select one location to observe how Earth's tilt affects daylight.
          Complete all 3 locations to finish the mission!
        </p>
      </div>
      
      <div className="locations-grid">
        {locations.map(location => {
          const status = getLocationStatus(location.id);
          const isCompleted = locationProgress[location.id]?.completed;
          
          return (
            <button
              key={location.id}
              className={`location-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => onSelectLocation(location)}
              disabled={isCompleted}
            >
              <div className="card-content">
                <div className="location-status" style={{ color: status.color }}>
                  {isCompleted ? '✓ Completed' : '○ Available'}
                </div>
                
                <div className="location-icon">
                  {location.id === 'ph' ? '🏝️' : 
                   location.id === 'ca' ? '🍁' : '🦘'}
                </div>
                
                <h3 className="location-name">{location.name}</h3>
                <p className="location-description">{location.description}</p>
                
                <div className="location-details">
                  <span className="detail">Latitude: {location.latitude}</span>
                  <span className="detail">Climate: {location.climate}</span>
                </div>
                
                <div className="location-fact">
                  <span>💡 {location.fact}</span>
                </div>
                
                {isCompleted && (
                  <div className="location-score">
                    <span className="score-label">Your Score:</span>
                    <span className="score-value">{locationProgress[location.id].score}/3 points</span>
                  </div>
                )}
              </div>
              
              <div className="select-indicator">
                {isCompleted ? (
                  <span className="completed-indicator">✓ Completed</span>
                ) : (
                  <span className="status-text" style={{ color: status.color }}>
                    {status.text}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="selector-footer">
        <div className="mission-summary">
          <div className="summary-item">
            <span className="summary-label">Locations Completed:</span>
            <span className="summary-value">
              {Object.values(locationProgress).filter(loc => loc.completed).length} of 3
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Score:</span>
            <span className="summary-value">
              {Object.values(locationProgress).reduce((sum, loc) => sum + loc.score, 0)} of 9 points
            </span>
          </div>
        </div>
        
        <p className="hint">
          💡 Hint: Complete all three locations to see how Earth's tilt affects different parts of the world!
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;