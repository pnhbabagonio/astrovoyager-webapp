import React from 'react';
import './LocationSelector.css';

const LocationSelector = ({ locations, onSelectLocation }) => {
  return (
    <div className="location-selector">
      <div className="selector-header">
        <h2>🌍 Choose Your Observation Location</h2>
        <p className="instruction">Select one location to observe how Earth's tilt affects daylight</p>
      </div>
      
      <div className="locations-grid">
        {locations.map(location => (
          <button
            key={location.id}
            className="location-card"
            onClick={() => onSelectLocation(location)}
          >
            <div className="card-content">
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
            </div>
            <div className="select-indicator">
              Click to Select →
            </div>
          </button>
        ))}
      </div>
      
      <div className="selector-footer">
        <p className="hint">💡 Hint: Each location will show different daylight patterns based on Earth's tilt!</p>
      </div>
    </div>
  );
};

export default LocationSelector;