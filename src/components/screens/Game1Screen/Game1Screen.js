import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './Game1Screen.css';

const Game1Screen = () => {
  const { dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  return (
    <div className="game-screen game1-screen">
      <div className="game-header">
        <h1>🌋 Island of Change</h1>
        <p>Disaster Response Training</p>
      </div>
      
      <div className="game-content">
        <div className="placeholder-message">
          <h2>Game Under Development</h2>
          <p>This is where the Island of Change gameplay will be implemented.</p>
          <p>Features will include:</p>
          <ul>
            <li>Role Selection (Farmer, Doctor, Rescuer)</li>
            <li>Disaster Scenarios (Typhoon, Volcanic Eruption, Drought)</li>
            <li>Choice-based Consequences</li>
            <li>Community Resilience Points</li>
          </ul>
        </div>
      </div>

      <div className="game-footer">
        <button onClick={handleBackToMap} className="back-button">
          ← Back to Mission Map
        </button>
      </div>
    </div>
  );
};

export default Game1Screen;