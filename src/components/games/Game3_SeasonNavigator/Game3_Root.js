// Game3_Root.js - Fixed with particle container
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import RegionSelector from './components/RegionSelector/RegionSelector';
import DragDropFillBlanks from './components/DragDropFillBlanks/DragDropFillBlanks';
import SeasonalTeleportationQuiz from './components/SeasonalTeleportationQuiz/SeasonalTeleportationQuiz';
import ObservationalCheck from './components/ObservationalCheck/ObservationalCheck';
import GameProgress from './components/GameProgress/GameProgress';
import Scoreboard from './components/Scoreboard/Scoreboard';
import ReviewIncorrectAnswers from './components/ReviewIncorrectAnswers/ReviewIncorrectAnswers';
import RegionCompletionScreen from './components/RegionCompletionScreen/RegionCompletionScreen';
import { game3Data } from './game3Data';
import './Game3.css';

const Game3_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();
  
  // Timer for analytics
  const startTimeRef = useRef(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Track mounted state and timeouts for cleanup
  const isMounted = useRef(true);
  const timeoutRefs = useRef([]);
  const particleContainerRef = useRef(null);

  // Game state
  const [gameState, setGameState] = useState({
    currentStep: 1,
    selectedRegion: null,
    completedRegions: [],
    regionScores: {},
    fillBlankAnswers: [],
    quizAnswers: [],
    observationalAnswers: [],
    totalScore: 0,
    showScoreboard: false,
    showReview: false,
    showRegionComplete: false,
    allRegionsCompleted: false
  });

  // Initialize timer with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      if (isMounted.current) {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize game with cleanup
  useEffect(() => {
    audioActions.playVoiceover('welcome_season_navigator');
    audioActions.playBackgroundMusic('space_exploration');
    
    // Create initial particle effect after mount
    if (isMounted.current) {
      setTimeout(() => {
        createParticles();
      }, 500);
    }

    return () => {
      // Clean up audio
      audioActions.stopBackgroundMusic();
    };
  }, [audioActions]);

  // Set up mounted state and cleanup
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      // Clear all timeouts
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
      
      // Clean up particle container
      if (particleContainerRef.current) {
        particleContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Helper function to safely add timeout
  const safeSetTimeout = (callback, delay) => {
    if (!isMounted.current) return null;
    
    const timeout = setTimeout(() => {
      if (isMounted.current) {
        callback();
      }
    }, delay);
    
    timeoutRefs.current.push(timeout);
    return timeout;
  };

  // Get particle container safely
  const getParticleContainer = () => {
    if (!isMounted.current) return null;
    
    if (!particleContainerRef.current) {
      // Try to find existing container or create new one
      let container = document.querySelector('.particle-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'particle-container';
        document.querySelector('.season-navigator-root')?.appendChild(container);
        particleContainerRef.current = container;
      } else {
        particleContainerRef.current = container;
      }
    }
    
    return particleContainerRef.current;
  };

  // Particle effect for space theme with safety checks
  const createParticles = () => {
    if (!isMounted.current) return;
    
    const container = getParticleContainer();
    if (!container) return;
    
    // Limit number of particles
    for (let i = 0; i < 30; i++) { // Reduced from 50
      safeSetTimeout(() => {
        if (!isMounted.current) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 95}vw`; // Keep within viewport
        particle.style.top = `${Math.random() * 90}vh`; // Keep within viewport
        particle.style.opacity = Math.random() * 0.4 + 0.2;
        
        try {
          container.appendChild(particle);
        } catch (error) {
          return;
        }
        
        safeSetTimeout(() => {
          if (particle.parentNode) {
            try {
              particle.parentNode.removeChild(particle);
            } catch (error) {
              // Particle already removed
            }
          }
        }, 2500); // Reduced from 3000
      }, i * 120); // Increased delay to reduce density
    }
  };

  // Reset region-specific data for new region
  const resetRegionData = () => {
    setGameState(prev => ({
      ...prev,
      fillBlankAnswers: [],
      quizAnswers: [],
      observationalAnswers: [],
      showScoreboard: false,
      showReview: false
    }));
  };

  // Handle region selection
  const handleRegionSelect = (region) => {
    // Check if region was already completed
    const isReplaying = gameState.completedRegions.includes(region.id);
    
    setGameState(prev => ({
      ...prev,
      selectedRegion: region,
      currentStep: isReplaying ? 5 : 2,
      showRegionComplete: isReplaying
    }));
    
    audioActions.playSoundEffect('teleport');
    
    // Create wormhole particle effect
    createTeleportEffect();
    
    // If replaying, show the region completion screen with previous score
    if (isReplaying) {
      safeSetTimeout(() => {
        if (!isMounted.current) return;
        
        setGameState(prev => ({
          ...prev,
          currentStep: 2,
          showRegionComplete: false
        }));
      }, 1000);
    }
  };

  // Teleport effect with proper positioning
  const createTeleportEffect = () => {
    if (!isMounted.current) return;
    
    const container = getParticleContainer();
    if (!container) return;
    
    // Clear existing particles first
    container.innerHTML = '';
    
    // Create centered teleport effect
    for (let i = 0; i < 20; i++) { // Reduced from 30
      safeSetTimeout(() => {
        if (!isMounted.current) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.backgroundColor = i % 2 === 0 ? '#9d4edd' : '#00f7ff';
        particle.style.boxShadow = `0 0 ${Math.random() * 8 + 3}px currentColor`;
        
        try {
          container.appendChild(particle);
        } catch (error) {
          return;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50; // Reduced distance
        
        safeSetTimeout(() => {
          if (particle.parentNode) {
            particle.style.transition = 'all 0.8s ease-out';
            particle.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
          }
          
          safeSetTimeout(() => {
            if (particle.parentNode) {
              try {
                particle.parentNode.removeChild(particle);
              } catch (error) {
                // Particle already removed
              }
            }
          }, 800);
        }, 50);
      }, i * 60); // Increased delay
    }
  };

  // Handle fill-in-blanks completion
  const handleFillBlanksComplete = (answers) => {
    const points = answers.reduce((sum, answer) => sum + (answer.isCorrect ? answer.points : 0), 0);
    
    setGameState(prev => ({
      ...prev,
      fillBlankAnswers: answers,
      totalScore: prev.totalScore + points,
      currentStep: 3
    }));
    
    audioActions.playSoundEffect('success');
    
    // Celebration particles
    createSuccessParticles();
  };

  const createSuccessParticles = () => {
    if (!isMounted.current) return;
    
    const container = getParticleContainer();
    if (!container) return;
    
    for (let i = 0; i < 15; i++) { // Reduced from 20
      safeSetTimeout(() => {
        if (!isMounted.current) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 90}vw`; // Keep within bounds
        particle.style.top = `${Math.random() * 80 + 10}vh`; // Keep within bounds
        particle.style.backgroundColor = '#ffd700';
        particle.style.boxShadow = '0 0 8px #ffd700';
        
        try {
          container.appendChild(particle);
        } catch (error) {
          return;
        }
        
        safeSetTimeout(() => {
          if (particle.parentNode) {
            try {
              particle.parentNode.removeChild(particle);
            } catch (error) {
              // Particle already removed
            }
          }
        }, 1800); // Reduced from 2000
      }, i * 80); // Increased delay
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (answers) => {
    const points = answers.reduce((sum, answer) => sum + (answer.isCorrect ? answer.points : 0), 0);
    const incorrectAnswers = answers.filter(answer => !answer.isCorrect);
    
    setGameState(prev => ({
      ...prev,
      quizAnswers: answers,
      totalScore: prev.totalScore + points,
      showScoreboard: true,
      showReview: incorrectAnswers.length > 0
    }));
    
    audioActions.playSoundEffect('quiz_complete');
  };

  // Handle proceed after scoreboard
  const handleProceedToObservational = () => {
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect('buttonClick');
  };

  // Handle review incorrect answers
  const handleReviewIncorrect = () => {
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      showReview: true
    }));
    audioActions.playSoundEffect('buttonClick');
  };

  // Handle return from review
  const handleReturnFromReview = () => {
    setGameState(prev => ({
      ...prev,
      showReview: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect('buttonClick');
  };

  // Handle observational check completion
  const handleObservationalComplete = (answers) => {
    const points = answers.reduce((sum, answer) => sum + answer.points, 0);
    const regionId = gameState.selectedRegion.id;
    
    // Calculate region score
    const fillBlankScore = gameState.fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
    const quizScore = gameState.quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
    const regionTotalScore = fillBlankScore + quizScore + points;
    
    // Check if all regions are now completed
    const newCompletedRegions = [...new Set([...gameState.completedRegions, regionId])];
    const allRegionsCompleted = newCompletedRegions.length === game3Data.regions.length;
    
    setGameState(prev => ({
      ...prev,
      observationalAnswers: answers,
      totalScore: prev.totalScore + points,
      regionScores: {
        ...prev.regionScores,
        [regionId]: regionTotalScore
      },
      completedRegions: newCompletedRegions,
      showRegionComplete: true,
      allRegionsCompleted: allRegionsCompleted,
      currentStep: 5
    }));
    
    audioActions.playSoundEffect('region_complete');
    
    // If all regions completed, save game progress
    if (allRegionsCompleted) {
      safeSetTimeout(() => {
        if (!isMounted.current) return;
        completeGame();
      }, 2000);
    }
  };

  // Handle continue to next region
  const handleContinueToNextRegion = () => {
    const remainingRegions = game3Data.regions.filter(
      region => !gameState.completedRegions.includes(region.id)
    );
    
    if (remainingRegions.length > 0) {
      resetRegionData();
      setGameState(prev => ({
        ...prev,
        selectedRegion: null,
        currentStep: 1,
        showRegionComplete: false
      }));
      audioActions.playSoundEffect('teleport');
    } else {
      if (isMounted.current) {
        completeGame();
      }
    }
  };

  // Handle replay same region
  const handleReplayRegion = () => {
    resetRegionData();
    setGameState(prev => ({
      ...prev,
      currentStep: 2,
      showRegionComplete: false
    }));
    audioActions.playSoundEffect('restart');
  };

  // Complete and save game (when all regions done)
  const completeGame = () => {
    if (!isMounted.current) return;
    
    const finalScore = {
      completed: true,
      totalScore: gameState.totalScore,
      regionScores: gameState.regionScores,
      completedRegions: gameState.completedRegions,
      timeElapsed: timeElapsed,
      dateCompleted: new Date().toISOString()
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game3', progress: finalScore }
    });

    // Save to player progress
    playerActions.updatePlayerProgress('game3', finalScore);

    // Call completion callback
    if (onComplete && isMounted.current) {
      onComplete(finalScore);
    }

    audioActions.playSoundEffect('game_complete');
  };

  // Handle back to map
  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  // Get current region's score
  const getCurrentRegionScore = () => {
    if (!gameState.selectedRegion) return 0;
    return gameState.regionScores[gameState.selectedRegion.id] || 0;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="season-navigator-root">
      {/* Space Nebula Background */}
      <div className="space-nebula"></div>
      
      {/* Particle Container - Will be created dynamically */}
      
      <div className="game3-header">
        <button onClick={handleBackToMap} className="back-button">
          Back to Starmap
        </button>
        <div className="header-content">
          <h1>Season Navigator</h1>
          <div className="header-subtitle">
            <span>🚀 Mission Control</span>
            <span>📍 Region: {gameState.selectedRegion?.name || 'Selecting...'}</span>
            <span>⏱️ Mission Time: {formatTime(timeElapsed)}</span>
            <span>✅ Regions: {gameState.completedRegions.length}/{game3Data.regions.length}</span>
          </div>
        </div>
        <div className="total-score-display">
          <span className="score-label">Mission Score</span>
          <span className="score-value">{gameState.totalScore}</span>
        </div>
      </div>

      <div className="game3-content">
        {/* Progress Indicator */}
        <GameProgress 
          currentStep={gameState.currentStep}
          totalSteps={4}
          selectedRegion={gameState.selectedRegion}
          score={gameState.totalScore}
          completedRegions={gameState.completedRegions}
        />

        {/* Main Game Steps */}
        {gameState.currentStep === 1 && !gameState.showScoreboard && !gameState.showReview && (
          <RegionSelector 
            regions={game3Data.regions}
            completedRegions={gameState.completedRegions}
            onSelect={handleRegionSelect}
          />
        )}

        {gameState.currentStep === 2 && !gameState.showScoreboard && !gameState.showReview && (
          <DragDropFillBlanks 
            sentences={game3Data.fillInBlanks}
            wordBank={game3Data.wordBank}
            selectedRegion={gameState.selectedRegion}
            onComplete={handleFillBlanksComplete}
          />
        )}

        {gameState.currentStep === 3 && !gameState.showScoreboard && !gameState.showReview && (
          <SeasonalTeleportationQuiz 
            scenarios={game3Data.quizScenarios}
            selectedRegion={gameState.selectedRegion}
            onComplete={handleQuizComplete}
          />
        )}

        {gameState.showScoreboard && (
          <Scoreboard 
            totalScore={getCurrentRegionScore()}
            maxScore={140}
            fillBlankAnswers={gameState.fillBlankAnswers}
            quizAnswers={gameState.quizAnswers}
            hasIncorrect={gameState.quizAnswers.some(a => !a.isCorrect)}
            onProceed={handleProceedToObservational}
            onReview={handleReviewIncorrect}
          />
        )}

        {gameState.showReview && (
          <ReviewIncorrectAnswers 
            incorrectAnswers={gameState.quizAnswers.filter(a => !a.isCorrect)}
            scenarios={game3Data.quizScenarios}
            onReturn={handleReturnFromReview}
          />
        )}

        {gameState.currentStep === 4 && !gameState.allRegionsCompleted && (
          <ObservationalCheck 
            questions={game3Data.observationalQuestions}
            onComplete={handleObservationalComplete}
          />
        )}

        {gameState.showRegionComplete && gameState.selectedRegion && (
          <RegionCompletionScreen 
            region={gameState.selectedRegion}
            regionScore={getCurrentRegionScore()}
            isReplay={gameState.completedRegions.includes(gameState.selectedRegion.id)}
            completedRegions={gameState.completedRegions}
            totalRegions={game3Data.regions.length}
            onContinue={handleContinueToNextRegion}
            onReplay={handleReplayRegion}
            onExit={handleBackToMap}
          />
        )}

        {gameState.allRegionsCompleted && (
          <div className="all-regions-completed">
            <div className="completion-content">
              <h2>🌠 Mission Complete!</h2>
              <div className="completion-badge">
                <span className="badge-icon">🏆</span>
                <span className="badge-text">All Regions Successfully Explored!</span>
              </div>
              
              <div className="final-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Mission Score</span>
                  <span className="stat-value">{gameState.totalScore}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Mission Duration</span>
                  <span className="stat-value">{formatTime(timeElapsed)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Regions Explored</span>
                  <span className="stat-value">
                    {gameState.completedRegions.length}/{game3Data.regions.length}
                  </span>
                </div>
              </div>
              
              <div className="region-scores-summary">
                <h3>🌍 Regional Analysis Report</h3>
                <div className="scores-grid">
                  {game3Data.regions.map(region => (
                    <div key={region.id} className="region-score-card">
                      <span className="region-name">{region.name}</span>
                      <span className="region-score">
                        {gameState.regionScores[region.id] || 0} points
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button onClick={handleBackToMap} className="continue-button">
                Return to Mission Control
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3_Root;