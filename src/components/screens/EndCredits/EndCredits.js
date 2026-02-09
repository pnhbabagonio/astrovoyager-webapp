// EndCredits.js
import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './EndCredits.css';

const EndCredits = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const creditsContainerRef = useRef(null);
  const creditsContentRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState(40); // pixels per second
  const [userInteracted, setUserInteracted] = useState(false);
  const [endingMusic, setEndingMusic] = useState(null);
  
  // Calculate total score
  const calculateTotalScore = () => {
    const { game1, game2, game3 } = gameState.gameProgress;
    const game1Score = game1.score || 0;
    const game2Score = game2.score || 0;
    const game3Score = game3.score || 0;
    
    return {
      game1Score,
      game2Score,
      game3Score,
      totalScore: game1Score + game2Score + game3Score
    };
  };

  const scores = calculateTotalScore();

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not completed';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Play ending credits music when component mounts
  useEffect(() => {
    audioActions.stopBackgroundMusic();
    
    const sound = new Howl({
      src: [`${process.env.PUBLIC_URL}/assets/audio/ending-credits-bg.mp3`],
      loop: true,
      volume: 0.3,
      autoplay: true,
      onloaderror: (id, error) => {
        console.warn('Could not load ending credits music:', error);
      },
      onplayerror: (id, error) => {
        console.warn('Could not play ending credits music:', error);
      }
    });

    setEndingMusic(sound);

    return () => {
      if (sound) {
        sound.stop();
      }
    };
  }, [audioActions]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !creditsContainerRef.current || userInteracted) return;

    let animationId;
    let lastTime = 0;

    const scrollCredits = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (creditsContainerRef.current) {
        const scrollAmount = (scrollSpeed * delta) / 1000;
        creditsContainerRef.current.scrollTop += scrollAmount;

        // Check if we've reached the bottom
        const { scrollTop, scrollHeight, clientHeight } = creditsContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsAutoScrolling(false);
        }
      }

      if (isAutoScrolling) {
        animationId = requestAnimationFrame(scrollCredits);
      }
    };

    animationId = requestAnimationFrame(scrollCredits);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAutoScrolling, scrollSpeed, userInteracted]);

  // Handle user interaction
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      setIsAutoScrolling(false);
    }
  };

  // Handle mouse wheel events
  useEffect(() => {
    const container = creditsContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      handleUserInteraction();
    };

    const handleTouchStart = () => {
      handleUserInteraction();
    };

    container.addEventListener('wheel', handleWheel);
    container.addEventListener('touchstart', handleTouchStart);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const handleReturnToLaunch = () => {
    if (endingMusic) {
      endingMusic.stop();
    }
    
    dispatch({ type: 'RESET_GAME' });
  };

  const toggleAutoScroll = () => {
    if (userInteracted) {
      setIsAutoScrolling(!isAutoScrolling);
    }
  };

  const adjustScrollSpeed = (faster) => {
    setScrollSpeed(prev => {
      const newSpeed = faster ? prev + 20 : prev - 20;
      return Math.max(20, Math.min(100, newSpeed));
    });
  };

  return (
    <div className="end-credits-container">
      <div className="space-background"></div>
      
      {/* Starfield overlay for cinematic effect */}
      <div className="starfield-overlay"></div>
      
      {/* Auto-scroll controls */}
      <div className="scroll-controls">
        <button 
          className="scroll-control-btn"
          onClick={toggleAutoScroll}
          title={isAutoScrolling ? "Pause Auto-scroll" : "Resume Auto-scroll"}
        >
          {isAutoScrolling ? '⏸️' : '▶️'}
        </button>
        <button 
          className="scroll-control-btn"
          onClick={() => adjustScrollSpeed(false)}
          title="Slower"
        >
          ➖
        </button>
        <button 
          className="scroll-control-btn"
          onClick={() => adjustScrollSpeed(true)}
          title="Faster"
        >
          ➕
        </button>
      </div>

      {/* Credits Content */}
      <div 
        className="credits-container"
        ref={creditsContainerRef}
        onWheel={handleUserInteraction}
        onTouchStart={handleUserInteraction}
        onMouseDown={handleUserInteraction}
      >
        <div className="credits-content" ref={creditsContentRef}>
          {/* Opening Title */}
          <div className="opening-title">
            <h1 className="mission-title">MISSION ACCOMPLISHED</h1>
            <div className="title-subtext">
              A Journey Through Space and Science
            </div>
          </div>

          {/* Scores Summary */}
          <div className="credits-section scores-summary">
            <div className="section-title">MISSION STATISTICS</div>
            
            <div className="score-row">
              <span className="game-name">ENERGY DETECTIVES</span>
              <span className="game-score">{scores.game1Score} points</span>
              <span className="game-status">
                {gameState.gameProgress.game1.completed ? 'COMPLETED' : 'INCOMPLETE'}
              </span>
            </div>
            
            <div className="score-row">
              <span className="game-name">TILT QUEST</span>
              <span className="game-score">{scores.game2Score} points</span>
              <span className="game-status">
                {gameState.gameProgress.game2.completed ? 'COMPLETED' : 'INCOMPLETE'}
              </span>
            </div>
            
            <div className="score-row">
              <span className="game-name">SEASON NAVIGATOR</span>
              <span className="game-score">{scores.game3Score} points</span>
              <span className="game-status">
                {gameState.gameProgress.game3.completed ? 'COMPLETED' : 'INCOMPLETE'}
              </span>
            </div>
            
            <div className="total-score-row">
              <span className="total-label">TOTAL MISSION SCORE</span>
              <span className="total-value">{scores.totalScore} POINTS</span>
            </div>
          </div>

          {/* Quote Section */}
          <div className="credits-section quote-section">
            <div className="section-title">MISSION PHILOSOPHY</div>
            <div className="quote">
              "Sometimes you have to go up really high to understand how small you really are."
            </div>
            <div className="quote-author">- Felix Baumgartner</div>
          </div>

          {/* Special Thanks */}
          <div className="credits-section special-thanks">
            <div className="section-title">SPECIAL THANKS</div>
            <div className="thanks-message">
              We extend our deepest gratitude to you, the player, for embarking on this
              educational journey through space and science. Your curiosity and dedication
              have made this mission a success.
            </div>
          </div>

          {/* Production Team */}
          <div className="credits-section production-team">
            <div className="section-title">PRODUCTION TEAM</div>
            
            <div className="team-row">
              <span className="role">GAME DESIGNER / AUTHOR</span>
              <span className="name">VINCE HENRY DIANA</span>
            </div>
            
            <div className="team-row">
              <span className="role">GAME ILLUSTRATOR</span>
              <span className="name">LESLEE HERNANDEZ</span>
            </div>
            
            <div className="team-row">
              <span className="role">GRAPHICS DESIGNER / GAME DEVELOPER</span>
              <span className="name">EDUARD FLORES</span>
            </div>
            
            <div className="team-row">
              <span className="role">GAME DEVELOPER</span>
              <span className="name">PHILIP NEEL BABAGONIO</span>
            </div>
          </div>

          {/* Additional Credits */}
          <div className="credits-section additional-credits">
            <div className="section-title">ADDITIONAL CREDITS</div>
            
            <div className="role-group">
              <div className="group-title">MISSION SUPPORT</div>
              <div className="role-row">Educational Consultants</div>
              <div className="role-row">Scientific Advisors</div>
              <div className="role-row">Quality Assurance Team</div>
            </div>
            
            <div className="role-group">
              <div className="group-title">TECHNICAL TEAM</div>
              <div className="role-row">Sound Design</div>
              <div className="role-row">UI/UX Design</div>
              <div className="role-row">Testing Team</div>
            </div>
          </div>

          {/* Final Message */}
          <div className="credits-section final-message">
            <div className="section-title">YOUR JOURNEY CONTINUES</div>
            <div className="final-text">
              The knowledge you've gained about our planet and its systems
              is just the beginning. Continue exploring, questioning, and
              discovering the wonders of our universe.
            </div>
            <div className="final-quote">
              The most beautiful thing we can experience is the mysterious.
              It is the source of all true art and science.
            </div>
          </div>

          {/* End Card */}
          <div className="end-card">
            <div className="thank-you">THANK YOU FOR PLAYING</div>
            <div className="game-title">ASTROVOYAGER</div>
            <div className="copyright">© 2026 All Rights Reserved</div>
            
            <button 
              className="return-to-launch"
              onClick={handleReturnToLaunch}
            >
              RETURN TO MISSION CONTROL
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!userInteracted && (
        <div className="auto-scroll-indicator">
          <div className="indicator-text">AUTO-SCROLLING CREDITS</div>
          <div className="indicator-subtext">Scroll or click to take control</div>
        </div>
      )}
    </div>
  );
};

export default EndCredits;