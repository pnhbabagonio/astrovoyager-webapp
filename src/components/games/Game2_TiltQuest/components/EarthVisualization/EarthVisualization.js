import React, { useState, useEffect, useRef } from 'react';
import './EarthVisualization.css';

const EarthVisualization = ({ location, earthState, onUpdateEarthState, onProceed }) => {
  const [daylightHours, setDaylightHours] = useState(12);
  const earthRef = useRef(null);
  
  // Calculate daylight based on earth state
  useEffect(() => {
    const calculateDaylight = () => {
      let hours = 12; // Base 12 hours
      
      if (earthState.tilt) {
        // Simplified calculation based on position and location
        const positionFactor = (earthState.position - 50) / 50;
        
        switch(location.id) {
          case 'ph': // Philippines (near equator)
            hours = 12 + (positionFactor * 1);
            break;
          case 'ca': // Canada (northern)
            hours = 12 + (positionFactor * 6);
            break;
          case 'au': // Australia (southern)
            hours = 12 - (positionFactor * 6);
            break;
          default:
            hours = 12;
        }
      }
      
      // Clamp between 6 and 18 hours
      return Math.max(6, Math.min(18, hours));
    };
    
    setDaylightHours(calculateDaylight());
  }, [earthState, location.id]);
  
  const handleTiltToggle = () => {
    onUpdateEarthState({
      ...earthState,
      tilt: !earthState.tilt
    });
  };
  
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    let season = 'equinox';
    
    if (value < 33) season = 'summer-solstice-north';
    else if (value > 66) season = 'winter-solstice-north';
    
    onUpdateEarthState({
      ...earthState,
      position: value,
      season
    });
  };
  
  const getSeasonName = () => {
    switch(earthState.season) {
      case 'summer-solstice-north':
        return 'Summer Solstice (June)';
      case 'winter-solstice-north':
        return 'Winter Solstice (December)';
      default:
        return 'Equinox (March/September)';
    }
  };
  
  return (
    <div className="earth-visualization">
      <div className="visualization-header">
        <h2>🌎 Observing: {location.name}</h2>
        <p className="coordinates">Latitude: {location.latitude}</p>
      </div>
      
      <div className="simulation-area">
        {/* Sun */}
        <div className="sun">
          <div className="sun-core"></div>
          <div className="sun-rays"></div>
          <span className="sun-label">Sun</span>
        </div>
        
        {/* Earth Container */}
        <div className="earth-container" style={{ left: `${earthState.position}%` }}>
          <div 
            ref={earthRef}
            className={`earth ${earthState.tilt ? 'tilted' : ''}`}
            style={{ transform: earthState.tilt ? 'rotate(23.5deg)' : 'rotate(0deg)' }}
          >
            {/* Earth Image with labels would go here */}
            <div className="earth-image">
              {/* This would be your Earth image */}
              <div className="earth-labels">
                <div className="label axis">Earth's Axis</div>
                <div className="label equator">Equator</div>
                <div className="label tropic-cancer">Tropic of Cancer</div>
                <div className="label tropic-capricorn">Tropic of Capricorn</div>
              </div>
              
              {/* Location Dot */}
              <div 
                className="location-dot"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
              >
                <div className="dot-pulse"></div>
                <span className="dot-label">{location.name}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sunlight Rays */}
        <div className="sunlight-rays">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="ray"
              style={{
                left: `${20 + (i * 15)}%`,
                opacity: 0.3 + (i * 0.1)
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="earth-controls">
        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Earth's Tilt:</span>
            <div className="toggle-switch">
              <button
                className={`toggle-option ${!earthState.tilt ? 'active' : ''}`}
                onClick={() => onUpdateEarthState({...earthState, tilt: false})}
              >
                OFF
              </button>
              <button
                className={`toggle-option ${earthState.tilt ? 'active' : ''}`}
                onClick={() => onUpdateEarthState({...earthState, tilt: true})}
              >
                ON
              </button>
            </div>
          </label>
          <p className="control-hint">
            {earthState.tilt 
              ? "🌍 Earth is tilted 23.5° - Notice how sunlight spreads unevenly!"
              : "🌍 Earth's axis is straight - Sunlight is evenly distributed"}
          </p>
        </div>
        
        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Earth's Position: {getSeasonName()}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={earthState.position}
            onChange={handleSliderChange}
            className="position-slider"
          />
          <div className="slider-markers">
            <span>Summer (June)</span>
            <span>Equinox</span>
            <span>Winter (December)</span>
          </div>
        </div>
      </div>
      
      {/* Daylight Indicator */}
      <div className="daylight-indicator">
        <div className="indicator-header">
          <h3>📏 Daylight Hours in {location.name}</h3>
          <div className="daylight-hours">
            <span className="hours-value">{daylightHours.toFixed(1)}</span>
            <span className="hours-unit">hours</span>
          </div>
        </div>
        <div className="daylight-bar-container">
          <div 
            className="daylight-bar"
            style={{ width: `${(daylightHours / 24) * 100}%` }}
          ></div>
          <div className="bar-labels">
            <span>0h</span>
            <span>12h (Equal)</span>
            <span>24h</span>
          </div>
        </div>
        <p className="daylight-note">
          {daylightHours > 12 ? "🌞 Longer day" : 
           daylightHours < 12 ? "🌙 Shorter day" : 
           "⚖️ Equal day and night"}
        </p>
      </div>
      
      {/* Navigation */}
      <div className="visualization-footer">
        <button className="proceed-button" onClick={onProceed}>
          Continue to Observation Check →
        </button>
        <p className="observation-tip">
          👁️ Observe how the daylight bar changes as you adjust tilt and position!
        </p>
      </div>
    </div>
  );
};

export default EarthVisualization;