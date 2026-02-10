// EndCredits.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import './EndCredits.css';

const EndCredits = () => {
  const { state: gameState, dispatch } = useGameState();
  const { actions: audioActions, state: audioState } = useAudio();
  const endingMusicRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const creditsContentRef = useRef(null);
  const endCardRef = useRef(null);
  const animationRef = useRef(null);

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

  // Stop animation when end card is in view
  const checkEndPosition = useCallback(() => {
    if (!creditsContentRef.current || !endCardRef.current || hasReachedEnd) return;

    const contentRect = creditsContentRef.current.getBoundingClientRect();
    const endCardRect = endCardRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if end card is approximately centered in viewport
    const endCardTopRelativeToViewport = endCardRect.top - contentRect.top;
    const targetPosition = viewportHeight / 2 - endCardRect.height / 2;
    
    // If end card is near the center of the viewport, stop the animation
    if (Math.abs(endCardTopRelativeToViewport - targetPosition) < 10) {
      setHasReachedEnd(true);
      setIsPaused(true);
      
      // Stop the CSS animation
      if (creditsContentRef.current) {
        creditsContentRef.current.style.animationPlayState = 'paused';
      }
    }
  }, [hasReachedEnd]);

  // Play ending credits music
  useEffect(() => {
    audioActions.stopBackgroundMusic();
    
    const timer = setTimeout(() => {
      const sound = new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/audio/ending-credits-bg.mp3`],
        loop: true,
        volume: audioState.muted ? 0 : 0.3,
        autoplay: true,
        html5: true,
        onloaderror: (id, error) => {
          console.warn('Could not load ending credits music:', error);
        }
      });

      endingMusicRef.current = sound;
    }, 500);

    return () => {
      clearTimeout(timer);
      if (endingMusicRef.current) {
        endingMusicRef.current.stop();
        endingMusicRef.current = null;
      }
    };
  }, [audioActions, audioState.muted]);

  // Set up animation and check position
  useEffect(() => {
    if (!creditsContentRef.current) return;

    // Set up animation
    animationRef.current = requestAnimationFrame(function animate() {
      checkEndPosition();
      animationRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [checkEndPosition]);

  const handleReturnToLaunch = () => {
    // Stop the ending music
    if (endingMusicRef.current) {
      endingMusicRef.current.stop();
      endingMusicRef.current = null;
    }
    
    // Clear session flag to allow fresh start
    sessionStorage.removeItem('astrovoyager_session_active');
    
    // Reset the game state
    dispatch({ type: 'RESET_GAME' });
    
    // Go back to loading screen for a fresh start
    dispatch({ type: 'SET_VIEW', payload: 'loading' });
  };

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    if (creditsContentRef.current && !hasReachedEnd) {
      creditsContentRef.current.style.animationPlayState = newPausedState ? 'paused' : 'running';
    }
  };

  // Handle manual scroll when paused
  const handleManualScroll = (direction) => {
    if (!creditsContentRef.current || !isPaused) return;
    
    const currentTransform = window.getComputedStyle(creditsContentRef.current).transform;
    const matrix = new DOMMatrixReadOnly(currentTransform);
    const currentY = matrix.m42;
    
    const scrollAmount = direction === 'up' ? 50 : -50;
    creditsContentRef.current.style.transform = `translateY(${currentY + scrollAmount}px)`;
    creditsContentRef.current.style.animation = 'none';
  };

  return (
    <div className="end-credits-container">
      <div className="space-background"></div>
      <div className="starfield-overlay"></div>
      
      {/* Scroll controls */}
      <div className="scroll-controls">
        <button 
          className="scroll-control-btn"
          onClick={togglePause}
          title={isPaused ? "Resume Credits" : "Pause Credits"}
          disabled={hasReachedEnd}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        
        {isPaused && !hasReachedEnd && (
          <div className="manual-scroll-controls">
            <button 
              className="scroll-arrow-btn"
              onClick={() => handleManualScroll('up')}
              title="Scroll Up"
            >
              ↑
            </button>
            <button 
              className="scroll-arrow-btn"
              onClick={() => handleManualScroll('down')}
              title="Scroll Down"
            >
              ↓
            </button>
          </div>
        )}
      </div>

      {/* Credits Content - Carousel */}
      <div className="credits-carousel">
        <div 
          ref={creditsContentRef}
          className={`credits-content ${isPaused ? 'paused' : ''} ${hasReachedEnd ? 'reached-end' : ''}`}
        >
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
                {gameState.gameProgress.game1.completed ? '✅ COMPLETED' : '❌ INCOMPLETE'}
              </span>
            </div>
            
            <div className="score-row">
              <span className="game-name">TILT QUEST</span>
              <span className="game-score">{scores.game2Score} points</span>
              <span className="game-status">
                {gameState.gameProgress.game2.completed ? '✅ COMPLETED' : '❌ INCOMPLETE'}
              </span>
            </div>
            
            <div className="score-row">
              <span className="game-name">SEASON NAVIGATOR</span>
              <span className="game-score">{scores.game3Score} points</span>
              <span className="game-status">
                {gameState.gameProgress.game3.completed ? '✅ COMPLETED' : '❌ INCOMPLETE'}
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
          <div ref={endCardRef} className="end-card">
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

      {/* Auto-scroll indicator */}
      {!isPaused && !hasReachedEnd && (
        <div className="auto-scroll-indicator">
          <div className="indicator-text">CREDITS ROLLING</div>
          <div className="indicator-subtext">Click pause to stop</div>
        </div>
      )}

      {/* End reached indicator */}
      {hasReachedEnd && (
        <div className="end-reached-indicator">
          <div className="indicator-text">CREDITS COMPLETE</div>
          <div className="indicator-subtext">Click button to continue</div>
        </div>
      )}
    </div>
  );
};

export default EndCredits;