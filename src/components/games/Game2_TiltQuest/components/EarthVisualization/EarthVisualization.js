import React, { useState, useEffect, useRef } from 'react';
import './EarthVisualization.css';

const EarthVisualization = ({ location, earthState, onUpdateEarthState, onProceed }) => {
  const [daylightHours, setDaylightHours] = useState(12);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const earthRef = useRef(null);
  
  // Image paths
  const earthImages = {
    tiltOff: `${process.env.PUBLIC_URL}/assets/images/game2/illustrations/tilt-off.png`,
    tiltOn: `${process.env.PUBLIC_URL}/assets/images/game2/illustrations/tilt-on.png`
  };
  
  const sunImage = `${process.env.PUBLIC_URL}/assets/images/game2/illustrations/sun.png`;
  
  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Preload images for better performance
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [
        earthImages.tiltOff,
        earthImages.tiltOn,
        sunImage
      ];
      
      let loadedCount = 0;
      const totalImages = imageUrls.length;
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${url}`);
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
      });
    };
    
    preloadImages();
  }, [earthImages.tiltOff, earthImages.tiltOn, sunImage]);
  
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
  
  // Determine if mobile for dynamic adjustments
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;
  
  return (
    <div className="earth-visualization">
      <div className="visualization-header">
        <h2><span className="header-emoji">🌎</span> Observing: {location.name}</h2>
        <p className="coordinates">Latitude: {location.latitude}</p>
      </div>
      
      <div className="simulation-area">
        {/* Sun - sizing handled by CSS */}
        <div className="sun">
          <img 
            src={sunImage} 
            alt="Sun" 
            className="sun-image"
            style={{ opacity: imagesLoaded ? 1 : 0 }}
          />
          <span className="sun-label">Sun</span>
        </div>
        
        {/* Earth Container - sizing handled by CSS */}
        <div className="earth-container" style={{ left: `${earthState.position}%` }}>
          <div 
            ref={earthRef}
            className={`earth ${earthState.tilt ? 'tilted' : ''}`}
            style={{ 
              transform: earthState.tilt ? 'rotate(23.5deg)' : 'rotate(0deg)' 
            }}
          >
            <div className="earth-image">
              <img 
                src={earthState.tilt ? earthImages.tiltOn : earthImages.tiltOff}
                alt="Earth"
                className="earth-real-image"
                style={{ 
                  opacity: imagesLoaded ? 1 : 0,
                  transform: earthState.tilt ? 'rotate(-23.5deg)' : 'rotate(0deg)'
                }}
              />
              
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
          {[...Array(isSmallMobile ? 3 : 5)].map((_, i) => (
            <div 
              key={i}
              className="ray"
              style={{
                left: `${20 + (i * (isSmallMobile ? 20 : 15))}%`,
                opacity: 0.3 + (i * 0.1)
              }}
            ></div>
          ))}
        </div>
        
        {/* Loading overlay */}
        {!imagesLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading images...</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="earth-controls">
        <div className="control-group tilt-control">
          <label className="control-label">
            <span className="label-text">Earth's Tilt:</span>
            <div 
              className={`tilt-toggle-switch ${earthState.tilt ? 'active' : ''}`}
              onClick={() => onUpdateEarthState({...earthState, tilt: !earthState.tilt})}
              role="switch"
              aria-checked={earthState.tilt}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onUpdateEarthState({...earthState, tilt: !earthState.tilt});
                }
              }}
            >
              <div className="tilt-track">
                <span className="tilt-label off">OFF</span>
                <span className="tilt-label on">ON</span>
              </div>
              <div className="tilt-thumb">
                <span className="tilt-icon">{earthState.tilt ? '🌎' : '🌍'}</span>
                <span className="tilt-angle">{earthState.tilt ? '23.5°' : '0°'}</span>
              </div>
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
            <span>Summer</span>
            <span>Equinox</span>
            <span>Winter</span>
          </div>
        </div>
      </div>
      
      {/* Daylight Indicator */}
      <div className="daylight-indicator">
        <div className="indicator-header">
          <h3>📏 Daylight Hours in {isSmallMobile ? location.name.split(' ')[0] : location.name}</h3>
          <div className="daylight-hours">
            <span className="hours-value">{daylightHours.toFixed(1)}</span>
            <span className="hours-unit">h</span>
          </div>
        </div>
        <div className="daylight-bar-container">
          <div 
            className="daylight-bar"
            style={{ width: `${(daylightHours / 24) * 100}%` }}
          ></div>
          <div className="bar-labels">
            <span>0h</span>
            <span>12h</span>
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
        <button 
          className="proceed-button" 
          onClick={onProceed}
          disabled={!imagesLoaded}
        >
          {imagesLoaded ? "Continue" : "Loading..."}
        </button>
        <p className="observation-tip">
          👁️ Observe how sunlight hits {isMobile ? 'your location' : location.name}
        </p>
      </div>
    </div>
  );
};

export default EarthVisualization;