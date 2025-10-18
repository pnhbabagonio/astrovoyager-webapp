import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './EndCredits.css';

const EndCredits = () => {
  const { state, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const handleRestart = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  return (
    <div className="end-credits">
      <div className="credits-content">
        <div className="congratulations">
          <h1>🎉 Congratulations! 🎉</h1>
          <p className="player-name">{state.playerData?.encodedName || 'Astronaut'}</p>
          <p>You have completed the Astrovoyager mission!</p>
        </div>

        <div className="achievements">
          <h2>Mission Achievements</h2>
          <div className="achievement-grid">
            <div className="achievement">
              <span className="achievement-icon">🌋</span>
              <span className="achievement-text">Island of Change Completed</span>
            </div>
            <div className="achievement">
              <span className="achievement-icon">🌦️</span>
              <span className="achievement-text">Weather Watchers Mastered</span>
            </div>
            <div className="achievement">
              <span className="achievement-icon">☀️</span>
              <span className="achievement-text">Sun Matching Expert</span>
            </div>
          </div>
        </div>

        <div className="final-score">
          <h2>Final Mission Score</h2>
          <div className="score-breakdown">
            <div className="score-item">
              <span>Resilience Points:</span>
              <span>{state.gameProgress.game1?.resiliencePoints || 0}</span>
            </div>
            <div className="score-item">
              <span>Preparedness Points:</span>
              <span>{state.gameProgress.game2?.preparednessPoints || 0}</span>
            </div>
            <div className="score-item">
              <span>Accuracy Points:</span>
              <span>{state.gameProgress.game3?.accuracyPoints || 0}</span>
            </div>
            <div className="score-total">
              <span>Total Score:</span>
              <span>
                {(state.gameProgress.game1?.resiliencePoints || 0) +
                 (state.gameProgress.game2?.preparednessPoints || 0) +
                 (state.gameProgress.game3?.accuracyPoints || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="credits-actions">
          <button onClick={handleBackToMap} className="credits-button">
            Back to Mission Map
          </button>
          <button onClick={handleRestart} className="credits-button primary">
            New Mission
          </button>
        </div>

        <div className="thank-you">
          <p>Thank you for playing Astrovoyager!</p>
          <p>Your journey through Philippine geography and atmospheric science is complete.</p>
        </div>
      </div>
    </div>
  );
};

export default EndCredits;