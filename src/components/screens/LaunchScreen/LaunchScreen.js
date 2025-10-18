import React, { useState } from 'react';
import './LaunchScreen.css';

const LaunchScreen = ({ onLaunch }) => {
  const [playerName, setPlayerName] = useState('');

  const handleLaunch = () => {
    if (playerName.trim()) {
      onLaunch(playerName.trim());
    }
  };

  return (
    <div className="launch-screen">
      <div className="stars"></div>
      <div className="content">
        <h1 className="main-title">ASTROVOYAGER</h1>
        <p className="subtitle">Embark on an Educational Space Journey</p>
        
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
            onKeyPress={(e) => e.key === 'Enter' && handleLaunch()}
          />
        </div>

        <button 
          onClick={handleLaunch}
          disabled={!playerName.trim()}
          className="launch-button"
        >
          🚀 BEGIN JOURNEY
        </button>

        <div className="mission-brief">
          <h3>Mission Objectives:</h3>
          <ul>
            <li>🌋 Master Disaster Response</li>
            <li>🌦️ Understand Weather Patterns</li>
            <li>☀️ Learn Seasonal Changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreen;