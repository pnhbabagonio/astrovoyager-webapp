import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './MissionMap.css';

const MissionMap = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const games = [
    {
      id: 1,
      name: 'Island of Change',
      description: 'Disaster Response Training',
      icon: '🌋',
      color: '#ff6b6b',
      route: 'game1'
    },
    {
      id: 2,
      name: 'Weather Watchers',
      description: 'Atmospheric Phenomena',
      icon: '🌦️',
      color: '#4facfe',
      route: 'game2'
    },
    {
      id: 3,
      name: 'Match the Sun',
      description: 'Seasons & Sun Position',
      icon: '☀️',
      color: '#ffa726',
      route: 'game3'
    }
  ];

  const handleGameSelect = (game) => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: game.route });
  };

  const handleBackToLaunch = () => {
    audioActions.playSoundEffect('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  return (
    <div className="mission-map">
      <div className="mission-map-header">
        <h1 className="mission-title">Mission Control</h1>
        <div className="player-welcome">
          Welcome, <span className="player-name">{gameState.playerData?.encodedName || 'Astronaut'}</span>!
        </div>
        <p className="mission-instruction">Choose your learning mission:</p>
      </div>

      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id}
            className="game-card"
            style={{ '--accent-color': game.color }}
            onClick={() => handleGameSelect(game)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3 className="game-title">{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-status">
              {gameState.gameProgress[`game${game.id}`]?.completed ? '✅ Completed' : '🟡 Ready to Launch'}
            </div>
          </div>
        ))}
      </div>

      <div className="mission-map-footer">
        <button onClick={handleBackToLaunch} className="back-button">
          ← Return to Launch
        </button>
        
        <div className="connection-status">
          <div className={`status-dot ${gameState.isOnline ? 'online' : 'offline'}`}></div>
          <span>Mission Control: {gameState.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-station">
        <div className="station-core"></div>
        <div className="solar-panel left"></div>
        <div className="solar-panel right"></div>
      </div>
    </div>
  );
};

export default MissionMap;