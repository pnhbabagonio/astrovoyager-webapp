// MissionMap.js - Updated with responsive island positioning (warning fixed)
import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './MissionMap.css';

// ✅ Use PUBLIC_URL paths
const mapBg = `${process.env.PUBLIC_URL}/assets/images/ui/map-bg.png`;
const island1Bg = `${process.env.PUBLIC_URL}/assets/images/game1/island-1.png`;
const island2Bg = `${process.env.PUBLIC_URL}/assets/images/game2/island-2.png`;
const island3Bg = `${process.env.PUBLIC_URL}/assets/images/game3/island-3.png`;
const annieCharacter = `${process.env.PUBLIC_URL}/assets/images/characters/annie.png`;

const MissionMap = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const greetingRef = useRef(null);
  const clickTimerRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive island positions based on screen size
  const getIslandPositions = () => {
    const { width } = windowSize; // Only using width for breakpoints
    const isMobile = width <= 768;
    const isTablet = width <= 1024 && width > 768;
    
    // Base positions as percentages of viewport
    if (isMobile) {
      // Mobile layout - stack vertically
      return {
        game1: { left: '15%', top: '20%' },
        game2: { left: '15%', top: '40%' },
        game3: { left: '15%', top: '60%' }
      };
    } else if (isTablet) {
      // Tablet layout - diagonal
      return {
        game1: { left: '5%', top: '40%' },
        game2: { left: '30%', top: '20%' },
        game3: { left: '55%', top: '5%' }
      };
    } else {
      // Desktop layout - original
      return {
        game1: { left: '5%', top: '45%' },
        game2: { left: '35%', top: '20%' },
        game3: { left: '65%', top: '1%' }
      };
    }
  };

  const islandPositions = getIslandPositions();

  const games = [
    {
      id: 1,
      name: 'Energy Detectives',
      description: 'Investigate Sun-related scenarios',
      img: island1Bg,
      route: 'game1',
      pos: islandPositions.game1,
      disabled: false
    },
    {
      id: 2,
      name: 'TiltQuest',
      description: 'Discover how Earth axial tilt works',
      img: island2Bg,
      route: 'game2',
      pos: islandPositions.game2,
      disabled: false
    },
    {
      id: 3,
      name: 'Season Navigator',
      description: 'Explore how seasons are created',
      img: island3Bg,
      route: 'game3',
      pos: islandPositions.game3,
      disabled: false
    },
  ];

  // Handle secret admin clicks
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    if (newCount >= 5) {
      setShowAdmin(true);
      setClickCount(0);
      audioActions.playSoundEffect?.('success');
      
      setTimeout(() => {
        setShowAdmin(false);
      }, 10000);
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  // Play Annie's greeting when component mounts
  useEffect(() => {
    let delayTimer;
    let visibilityTimer;

    visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    delayTimer = setTimeout(() => {
      if (!greetingPlayed && audioActions.playVoiceover) {
        console.log('Playing Annie welcome audio');
        try {
          const sound = audioActions.playVoiceover('annieWelcome') || 
                       audioActions.playVoiceover('welcome');
          
          if (sound) {
            greetingRef.current = sound;
            setGreetingPlayed(true);
            
            const characterElement = document.querySelector('.character-image');
            if (characterElement) {
              characterElement.classList.add('talking');
              setTimeout(() => {
                characterElement.classList.remove('talking');
              }, 3000);
            }
          }
        } catch (error) {
          console.error('Error playing Annie greeting:', error);
        }
      }
    }, 1500);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(visibilityTimer);
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      
      if (greetingRef.current && greetingRef.current.stop) {
        greetingRef.current.stop();
      }
    };
  }, [audioActions, greetingPlayed]);

  const handleCharacterClick = () => {
    if (audioActions.playVoiceover) {
      console.log('Replaying Annie greeting');
      audioActions.playSoundEffect?.('buttonClick');
      
      const sound = audioActions.playVoiceover('annieWelcome') || 
                   audioActions.playVoiceover('welcome');
      
      if (sound) {
        greetingRef.current = sound;
        
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
      return;
    }
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: game.route });
  };

  const handleBackToLaunch = () => {
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  const handleAdminClick = () => {
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'data-export' });
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
      onClick={handleSecretClick}
    >
      <div className="overlay" />

      <header className="mission-map-header">
        <button onClick={handleBackToLaunch} className="back-button">
          <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" fill="currentColor"/>
            <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="back-text">Base Camp</span>
          <div className="back-btn-shine"></div>
        </button>

        {showAdmin && (
          <button 
            onClick={handleAdminClick} 
            className="admin-button"
            title="Access Admin Panel to export player data"
          >
            🔧 Admin Panel
          </button>
        )}
      </header>

      {clickCount > 0 && clickCount < 5 && (
        <div className="click-counter">
          {clickCount} / 5 clicks for admin
        </div>
      )}

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