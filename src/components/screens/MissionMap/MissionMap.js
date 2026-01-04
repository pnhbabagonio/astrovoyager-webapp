import React from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './MissionMap.css';

// ✅ Use PUBLIC_URL paths
const mapBg = `${process.env.PUBLIC_URL}/assets/images/ui/map-bg.png`;
const island1Bg = `${process.env.PUBLIC_URL}/assets/images/game1/weather-watcher.png`;
const island2Bg = `${process.env.PUBLIC_URL}/assets/images/game2/match-the-sun.png`;
const island3Bg = `${process.env.PUBLIC_URL}/assets/images/game3/island-of-change.png`;
const annieCharacter = `${process.env.PUBLIC_URL}/assets/images/characters/annie.png`;

const MissionMap = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();

  const games = [
  {
    id: 1,
    name: 'ASTROVOYAGER – Energy Detectives',
    description: 'Investigate Sun-related scenarios, predict outcomes, and explain your scientific reasoning.',
    img: island1Bg,
    route: 'game1',
    pos: { left: '0%', top: '43%' },
    disabled: false
  },
  {
    id: 2,
    name: 'ASTROVOYAGER – TiltQuest',
    description: 'Discover how Earth’s axial tilt changes day length—not distance from the Sun.',
    img: island2Bg,
    route: 'game2',
    pos: { left: '35%', top: '20%' },
    disabled: false
  },
  {
    id: 3,
    name: 'ASTROVOYAGER – Season Navigator',
    description: 'Explore how Earth’s tilt and orbit create seasons through changing sunlight.',
    img: island3Bg,
    route: 'game3',
    pos: { left: '70%', top: '-15%' },
    disabled: false
  },
];

  const handleGameSelect = (game) => {
    if (game.disabled) {
      audioActions.playSoundEffect?.('error');
      return; // Don't proceed if game is disabled
    }
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
            className={`island ${gameState.gameProgress[`game${g.id}`]?.completed ? 'completed' : ''} ${g.disabled ? 'disabled' : ''}`}
            style={{
              left: g.pos.left,
              top: g.pos.top,
            }}
            onClick={() => handleGameSelect(g)}
            aria-label={`Launch ${g.name} mission`}
            disabled={g.disabled}
          >
            <img 
              src={g.img}
              alt={g.name}
              className="island-image"
            />
            <div className="island-glow"></div>
            
            {/* REMOVED: Under Revision Sign */}
            
            <div className="island-label">
              <h3 className="label-name">{g.name}</h3>
              <p className="label-desc">{g.description}</p>
              <div className="mission-status">
                {gameState.gameProgress[`game${g.id}`]?.completed ? (
                  '✅ Complete'
                ) : (
                  '🟡 Ready'
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MissionMap;