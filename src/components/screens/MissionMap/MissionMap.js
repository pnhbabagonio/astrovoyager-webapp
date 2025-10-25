import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './MissionMap.css';

// ✅ Use PUBLIC_URL paths
const mapBg = `${process.env.PUBLIC_URL}/assets/images/ui/map-bg.png`;
const island1Bg = `${process.env.PUBLIC_URL}/assets/images/game1/island-of-change.png`;
const island2Bg = `${process.env.PUBLIC_URL}/assets/images/game2/weather-watcher.png`;
const island3Bg = `${process.env.PUBLIC_URL}/assets/images/game3/match-the-sun.png`;
const annieCharacter = `${process.env.PUBLIC_URL}/assets/images/characters/annie.png`;

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
      pos: { left: '5%', top: '18%' },
    },
    {
      id: 2,
      name: 'Weather Watchers',
      description: 'Atmospheric Phenomena',
      img: island2Bg,
      route: 'game2',
      pos: { left: '35%', top: '5%' },
    },
    {
      id: 3,
      name: 'Match the Sun',
      description: 'Seasons & Sun Position',
      img: island3Bg,
      route: 'game3',
      pos: { left: '65%', top: '0%' },
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
        {/* Back button moved to header */}
        <button onClick={handleBackToLaunch} className="back-button">
          ← Base Camp
        </button>
      </header>

      {/* Character and Text Bubble at Center */}
      <div className="character-container">
        <div className="text-bubble">
          <p>Welcome, <span className="player-name">{gameState.playerData?.encodedName || 'Explorer'}</span>! Choose your mission.</p>
          <div className="bubble-tail"></div>
        </div>
        <img 
          src={annieCharacter} 
          alt="Annie the Guide" 
          className="character-image"
        />
      </div>

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