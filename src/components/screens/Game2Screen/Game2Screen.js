import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './Game2Screen.css';

const Game2Screen = () => {
  const { dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  return (
    <div className="game-screen game2-screen">
      <div className="game-header">
        <h1>☁️ Weather Watchers</h1>
        <p>Climate Awareness and Forecast Challenge</p>
      </div>
      
      <div className="game-content">
        <div className="placeholder-message">
          <h2>Game Under Development</h2>
          <p>This is where the Weather Watchers gameplay will be implemented.</p>
          <p>Features will include:</p>
          <ul>
            <li>Predicting weather patterns</li>
            <li>Learning climate impact through scenarios</li>
            <li>Interactive storm tracking maps</li>
            <li>Points for accurate forecasting</li>
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

export default Game2Screen;
