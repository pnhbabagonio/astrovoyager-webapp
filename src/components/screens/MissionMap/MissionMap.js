// MissionMap.js - Updated with audio greeting
import React, { useEffect, useState, useRef } from 'react'; // Added hooks
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
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const greetingRef = useRef(null);

  const games = [
    {
      id: 1,
      name: 'Energy Detectives',
      description: 'Investigate Sun-related scenarios and explain your reasoning.',
      img: island1Bg,
      route: 'game1',
      pos: { left: '5%', top: '45%' },
      disabled: false
    },
    {
      id: 2,
      name: 'TiltQuest',
      description: 'Discover how Earth axial tilt changes day length.',
      img: island2Bg,
      route: 'game2',
      pos: { left: '35%', top: '20%' },
      disabled: false
    },
    {
      id: 3,
      name: 'Season Navigator',
      description: 'Explore how tilt and orbit create seasons.',
      img: island3Bg,
      route: 'game3',
      pos: { left: '65%', top: '1%' },
      disabled: false
    },
  ];

  // Play Annie's greeting when component mounts
  useEffect(() => {
    let delayTimer;
    let visibilityTimer;

    // First, set component as visible (for fade-in animations if any)
    visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Then play greeting after a delay
    delayTimer = setTimeout(() => {
      if (!greetingPlayed && audioActions.playVoiceover) {
        console.log('Playing Annie welcome audio');
        try {
          // Try 'annieWelcome' key first, fallback to 'welcome'
          const sound = audioActions.playVoiceover('annieWelcome') || 
                       audioActions.playVoiceover('welcome');
          
          if (sound) {
            greetingRef.current = sound;
            setGreetingPlayed(true);
            
            // Optional: Add a visual cue when audio plays
            const characterElement = document.querySelector('.character-image');
            if (characterElement) {
              characterElement.classList.add('talking');
              setTimeout(() => {
                characterElement.classList.remove('talking');
              }, 3000); // Remove after audio duration
            }
          }
        } catch (error) {
          console.error('Error playing Annie greeting:', error);
        }
      }
    }, 1500); // 1.5 second delay before playing

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(visibilityTimer);
      
      // Clean up any playing audio if component unmounts
      if (greetingRef.current && greetingRef.current.stop) {
        greetingRef.current.stop();
      }
    };
  }, [audioActions, greetingPlayed]);

  // Replay greeting when user interacts with Annie
  const handleCharacterClick = () => {
    if (audioActions.playVoiceover) {
      console.log('Replaying Annie greeting');
      audioActions.playSoundEffect?.('buttonClick');
      
      // Play the greeting again
      const sound = audioActions.playVoiceover('annieWelcome') || 
                   audioActions.playVoiceover('welcome');
      
      if (sound) {
        greetingRef.current = sound;
        
        // Add talking animation
        const characterElement = document.querySelector('.character-image');
        if (characterElement) {
          characterElement.classList.add('talking');
          setTimeout(() => {
            characterElement.classList.remove('talking');
          }, 3000);
        }
      }
    }
  };

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
      className={`mission-map ${isVisible ? 'visible' : ''}`}
      style={{
        backgroundImage: `url(${mapBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="overlay" />

      <header className="mission-map-header">
        {/* Back button moved to header */}
        <button onClick={handleBackToLaunch} className="back-button">
          <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" fill="currentColor"/>
            <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="back-text">Base Camp</span>
          <div className="back-btn-shine"></div>
        </button>
      </header>

      {/* Character and Text Bubble at Center - Now clickable */}
      <div className="character-container">
        <div className="text-bubble">
          <p>Welcome, <span className="player-name">{gameState.playerData?.encodedName || 'Explorer'}</span>! Choose your mission.</p>
          <div className="bubble-tail"></div>
        </div>
        <img 
          src={annieCharacter} 
          alt="Annie the Guide" 
          className="character-image"
          onClick={handleCharacterClick}
          style={{ cursor: 'pointer' }}
          title="Click to hear greeting again"
        />
      </div>

      {/* Optional: Audio status indicator */}
      {/* {greetingPlayed && (
        <div className="audio-status-indicator">
          🔊 Annie is here to guide you!
        </div>
      )} */}

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