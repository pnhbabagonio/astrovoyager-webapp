// LaunchScreen.js
import React, { useState } from 'react';
import './LaunchScreen.css';

const LaunchScreen = ({ onLaunch }) => {
  const [playerName, setPlayerName] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleLaunch = () => {
    if (playerName.trim()) {
      onLaunch(playerName.trim());
    }
  };

  const handleButtonPress = () => {
    if (!playerName.trim()) return;
    
    setIsButtonPressed(true);
    // Reset the pressed state after a short delay for visual feedback
    setTimeout(() => {
      setIsButtonPressed(false);
      handleLaunch();
    }, 150);
  };

  const handleMouseDown = () => {
    if (playerName.trim()) {
      setIsButtonPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsButtonPressed(false);
  };

  const handleMouseLeave = () => {
    setIsButtonPressed(false);
  };

  return (
    <div 
      className="launch-screen"
      style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/launch-screen-bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="content">
        {/* Main Title Image */}
        <div className="title-image-container">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/images/ui/astrovoyager-title.png`}
            alt="ASTROVOYAGER"
            className="main-title-image"
          />
        </div>
        
        {/* <p className="subtitle">Embark on an Educational Space Journey</p> */}
        
<div className="input-section">
  <div className={`name-plate ${playerName.trim() ? 'ready' : ''}`}>
    <span className="plate-icon">🚀</span>

    <input
      type="text"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)}
      placeholder="Astronaut Quincy"
      className="plate-input"
      maxLength={16}
      onKeyUp={(e) => e.key === 'Enter' && handleButtonPress()}
    />
  </div>

  <div className="plate-caption">
    Enter your name to begin your mission
  </div>
</div>



        {/* Image Button with Press Animation */}
        <div 
          className={`image-button-container ${!playerName.trim() ? 'disabled' : ''} ${isButtonPressed ? 'pressed' : ''}`}
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

        {/* <div className="mission-brief">
          <h3>Mission Objectives:</h3>
          <ul>
            <li>🌋 Master Disaster Response</li>
            <li>🌦️ Understand Weather Patterns</li>
            <li>☀️ Learn Seasonal Changes</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default LaunchScreen;