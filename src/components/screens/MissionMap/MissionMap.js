import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './MissionMap.css';

// ✅ Use PUBLIC_URL paths
const mapBg = `${process.env.PUBLIC_URL}/assets/images/ui/map-bg.png`;
const island1Bg = `${process.env.PUBLIC_URL}/assets/images/game1/island-of-change.png`;
const island2Bg = `${process.env.PUBLIC_URL}/assets/images/game2/weather-watcher.png`;
const island3Bg = `${process.env.PUBLIC_URL}/assets/images/game3/match-the-sun.png`;

const MissionMap = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const games = [
    {
      id: 1,
      name: 'Island of Change',
      description: 'Disaster Response Training',
      img: island1Bg,
      route: 'game1',
      pos: { left: '6%', top: '8%' },
    },
    {
      id: 2,
      name: 'Weather Watchers',
      description: 'Atmospheric Phenomena',
      img: island2Bg,
      route: 'game2',
      pos: { left: '42%', top: '28%' },
    },
    {
      id: 3,
      name: 'Match the Sun',
      description: 'Seasons & Sun Position',
      img: island3Bg,
      route: 'game3',
      pos: { left: '72%', top: '62%' },
    },
  ];

  const handleGameSelect = (game) => {
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: game.route });
  };

  const handleBackToLaunch = () => {
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  return (
    <div
      className="mission-map"
      style={{
        backgroundImage: `url(${mapBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="overlay" />

      {/* Static white dashed line path */}
      <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M8 12 C28 18, 40 28, 44 32 C55 40, 66 48, 72 56 C78 64, 86 70, 76 76"
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="0.6"
          strokeDasharray="0.6 0.9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <header className="mission-map-header">
        <h1 className="mission-title">MISSION MAP</h1>
        <div className="player-welcome">
          Welcome, <span className="player-name">{gameState.playerData?.encodedName || 'Astronaut'}</span>
        </div>
        <p className="mission-instruction">Hover an island to reveal the mission — click to launch.</p>
      </header>

      <div className="islands-layer">
        {games.map((g) => (
          <button
            key={g.id}
            className="island"
            style={{
              left: g.pos.left,
              top: g.pos.top,
              backgroundImage: `url(${g.img})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            onClick={() => handleGameSelect(g)}
            aria-label={g.name}
            onMouseDown={(e) => e.currentTarget.classList.add('pressed')}
            onMouseUp={(e) => e.currentTarget.classList.remove('pressed')}
          >
            <div className="island-label">
              <div className="label-inner">
                <div className="label-name">{g.name}</div>
                <div className="label-desc">{g.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <footer className="mission-map-footer">
        <button onClick={handleBackToLaunch} className="back-button">
          ← Return to Launch
        </button>

        <div className="connection-status">
          <div className={`status-dot ${gameState.isOnline ? 'online' : 'offline'}`} />
          <span>Mission Control: {gameState.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </footer>
    </div>
  );
};

export default MissionMap;
