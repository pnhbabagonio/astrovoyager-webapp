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
      pos: { left: '5%', top: '5%' },
    },
    {
      id: 2,
      name: 'Weather Watchers',
      description: 'Atmospheric Phenomena',
      img: island2Bg,
      route: 'game2',
      pos: { left: '35%', top: '20%' },
    },
    {
      id: 3,
      name: 'Match the Sun',
      description: 'Seasons & Sun Position',
      img: island3Bg,
      route: 'game3',
      pos: { left: '65%', top: '5%' },
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

      <header className="mission-map-header">
        <h1 className="mission-title">EXPEDITION MAP</h1>
        <div className="player-welcome">
          Welcome, <span className="player-name">{gameState.playerData?.encodedName || 'Explorer'}</span>
        </div>        
        {/* Back button moved to header */}
        <button onClick={handleBackToLaunch} className="back-button">
          ← Base Camp
        </button>
      </header>

      <div className="islands-layer">
        {games.map((g) => (
          <button
            key={g.id}
            className={`island ${gameState.gameProgress[`game${g.id}`]?.completed ? 'completed' : ''}`}
            style={{
              left: g.pos.left,
              top: g.pos.top,
            }}
            onClick={() => handleGameSelect(g)}
            aria-label={`Launch ${g.name} mission`}
          >
            <img 
              src={g.img}
              alt={g.name}
              className="island-image"
            />
            <div className="island-glow"></div>
            <div className="island-label">
              <h3 className="label-name">{g.name}</h3>
              <p className="label-desc">{g.description}</p>
              <div className="mission-status">
                {gameState.gameProgress[`game${g.id}`]?.completed ? '✅ Complete' : '🟡 Ready'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MissionMap;