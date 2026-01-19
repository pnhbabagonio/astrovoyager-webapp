// LaunchScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './LaunchScreen.css';

// Generate stars once and memoize
const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));
};

// Generate shooting stars
const generateShootingStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 4 + Math.random() * 2,
    duration: Math.random() * 1 + 0.8,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 30 + 10}%`,
  }));
};

const LaunchScreen = ({ onLaunch }) => {
  const [playerName, setPlayerName] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Memoize stars to prevent regeneration on every render
  const stars = useMemo(() => generateStars(100), []);
  const shootingStars = useMemo(() => generateShootingStars(5), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLaunch = useCallback(() => {
    if (playerName.trim()) {
      setIsLaunching(true);
      setTimeout(() => {
        onLaunch(playerName.trim());
      }, 800);
    }
  }, [playerName, onLaunch]);

  const handleButtonPress = useCallback(() => {
    if (!playerName.trim() || isLaunching) return;
    
    setIsButtonPressed(true);
    setTimeout(() => {
      setIsButtonPressed(false);
      handleLaunch();
    }, 150);
  }, [playerName, isLaunching, handleLaunch]);

  const handleMouseDown = useCallback(() => {
    if (playerName.trim() && !isLaunching) {
      setIsButtonPressed(true);
    }
  }, [playerName, isLaunching]);

  const handleMouseUp = useCallback(() => {
    setIsButtonPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsButtonPressed(false);
  }, []);

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Enter') {
      handleButtonPress();
    }
  }, [handleButtonPress]);

  return (
    <div className={`launch-screen-modern ${isMounted ? 'mounted' : ''} ${isLaunching ? 'launching' : ''}`}>
      {/* Animated Starfield Background */}
      <div className="starfield">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="shooting-stars">
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="nebula nebula-3"></div>

      {/* Orbital Rings */}
      <div className="orbital-rings">
        <div className="orbital-ring ring-1"></div>
        <div className="orbital-ring ring-2"></div>
        <div className="orbital-ring ring-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-modern">
        {/* Main Title Image with Enhanced Glow */}
        <div className="title-container-modern">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/images/ui/astrovoyager-title.png`}
            alt="ASTROVOYAGER"
            className="main-title-modern"
          />
          <div className="title-glow"></div>
        </div>
        
        {/* <p className="subtitle">Embark on an Educational Space Journey</p> */}
        
        <div className="input-section">
          <label htmlFor="playerName" className="input-label">
            Enter Your Astronaut Name:
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g., Astronaut Quincy"
            className="name-input"
            onKeyUp={(e) => e.key === 'Enter' && handleButtonPress()}
          />
        </div>

        {/* Image Button with Press Animation */}
        <div 
          className={`image-button-container ${!playerName.trim() ? 'disabled' : ''} ${isButtonPressed ? 'pressed' : ''} ${isLaunching ? 'launching' : ''}`}
          onClick={handleButtonPress}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <img 
            src={
              isButtonPressed 
                ? `${process.env.PUBLIC_URL}/assets/images/ui/ifPressed.png`
                : `${process.env.PUBLIC_URL}/assets/images/ui/atRest.png`
            }
            alt="BEGIN JOURNEY"
            className="start-button-image"
          />
        </div>

        {/* Status Indicator */}
        <div className={`status-indicator ${playerName.trim() ? 'ready' : ''}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {playerName.trim() ? 'Systems Ready for Launch' : 'Awaiting Astronaut Identification'}
          </span>
        </div>

        {/* Mission Stats Preview */}
        <div className="mission-preview">
          <div className="preview-item">
            <span className="preview-icon">🎯</span>
            <span className="preview-text">3 Missions</span>
          </div>
          <div className="preview-divider"></div>
          <div className="preview-item">
            <span className="preview-icon">⭐</span>
            <span className="preview-text">Learn & Explore</span>
          </div>
          <div className="preview-divider"></div>
          <div className="preview-item">
            <span className="preview-icon">🏆</span>
            <span className="preview-text">Earn Rewards</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="bottom-fade"></div>
    </div>
  );
};

export default LaunchScreen;