import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './Game3Screen.css';

const Game3Screen = () => {
  const { dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  return (
    <div className="game-screen game3-screen">
      <div className="game-header">
        <h1>🌱 Guardians of Growth</h1>
        <p>Sustainable Farming Adventure</p>
      </div>
      
      <div className="game-content">
        <div className="placeholder-message">
          <h2>Game Under Development</h2>
          <p>This is where the Guardians of Growth gameplay will be implemented.</p>
          <p>Features will include:</p>
          <ul>
            <li>Eco-friendly farming decisions</li>
            <li>Resource management and crop cycles</li>
            <li>Soil and water sustainability challenges</li>
            <li>Community collaboration for green goals</li>
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

export default Game3Screen;
