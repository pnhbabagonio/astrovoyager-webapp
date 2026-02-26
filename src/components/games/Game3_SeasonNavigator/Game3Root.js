import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import RegionSelector from './components/RegionSelector/RegionSelector';
import DragDropFillBlanks from './components/DragDropFillBlanks/DragDropFillBlanks';
import SeasonalTeleportationQuiz from './components/SeasonalTeleportationQuiz/SeasonalTeleportationQuiz';
import ObservationalCheck from './components/ObservationalCheck/ObservationalCheck';
import Scoreboard from './components/Scoreboard/Scoreboard';
import CompactGameProgress from './components/GameProgress/CompactGameProgress';
import ReviewIncorrectAnswers from './components/ReviewIncorrectAnswers/ReviewIncorrectAnswers';
import RegionCompletionScreen from './components/RegionCompletionScreen/RegionCompletionScreen';
import { game3Data } from './game3Data';
import './Game3.css';

const Game3Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();
  
  const startTimeRef = useRef(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const isMounted = useRef(true);
  const audioTimeouts = useRef([]);
  
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
    allRegionsCompleted: false,
    currentSeason: 'spring'
  });

  // Clear all audio timeouts helper
  const clearAllTimeouts = () => {
    audioTimeouts.current.forEach(timeout => clearTimeout(timeout));
    audioTimeouts.current = [];
  };

  // Calculate max scores
  const maxScorePerRegion = 150; // 40 (fill blanks) + 90 (quiz) + 20 (observational)
  const MAX_TOTAL_SCORE = maxScorePerRegion * game3Data.regions.length; // 450 total

  // Initialize timer
  useEffect(() => {
    isMounted.current = true;
    
    const timer = setInterval(() => {
      if (isMounted.current) {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Initialize game - REMOVED background music call
  useEffect(() => {
    isMounted.current = true;
    
    // REMOVED: audioActions.playBackgroundMusic('adventure');
    // App.js will handle background music based on view
    
    // Optional: Play a welcome voiceover if needed
    // const voiceoverTimeout = setTimeout(() => {
    //   if (isMounted.current && audioActions.playVoiceover) {
    //     audioActions.playVoiceover('welcome_celestial_observatory');
    //   }
    // }, 800);
    // 
    // audioTimeouts.current.push(voiceoverTimeout);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearAllTimeouts();
      // Don't stop background music - let App.js handle it
    };
  }, [audioActions]);

  // Update season based on selected region
  useEffect(() => {
    if (gameState.selectedRegion && isMounted.current) {
      setGameState(prev => ({
        ...prev,
        currentSeason: gameState.selectedRegion.currentSeason?.toLowerCase() || 'spring'
      }));
    }
  }, [gameState.selectedRegion]);

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
    if (!isMounted.current) return;
    
    const isReplaying = gameState.completedRegions.includes(region.id);
    
    setGameState(prev => ({
      ...prev,
      selectedRegion: region,
      currentStep: isReplaying ? 5 : 2,
      showRegionComplete: isReplaying
    }));
    
    audioActions.playSoundEffect?.('telescope_focus');
    
    if (isReplaying) {
      const replayTimeout = setTimeout(() => {
        if (isMounted.current) {
          setGameState(prev => ({
            ...prev,
            currentStep: 2,
            showRegionComplete: false
          }));
        }
      }, 1000);
      
      audioTimeouts.current.push(replayTimeout);
    }
  };

  // Handle fill-in-blanks completion
  const handleFillBlanksComplete = (answers) => {
    if (!isMounted.current) return;
    
    const points = answers.reduce((sum, answer) => sum + (answer.isCorrect ? answer.points : 0), 0);
    
    setGameState(prev => ({
      ...prev,
      fillBlankAnswers: answers,
      totalScore: prev.totalScore + points,
      currentStep: 3
    }));
    
    audioActions.playSoundEffect?.('data_analysis_complete');
  };

  // Handle quiz completion
  const handleQuizComplete = (answers) => {
    if (!isMounted.current) return;
    
    const points = answers.reduce((sum, answer) => sum + (answer.isCorrect ? answer.points : 0), 0);
    const incorrectAnswers = answers.filter(answer => !answer.isCorrect);
    
    setGameState(prev => ({
      ...prev,
      quizAnswers: answers,
      totalScore: prev.totalScore + points,
      showScoreboard: true,
      showReview: incorrectAnswers.length > 0
    }));
    
    audioActions.playSoundEffect?.('warp_complete');
  };

  // Handle proceed after scoreboard
  const handleProceedToObservational = () => {
    if (!isMounted.current) return;
    
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect?.('control_click');
  };

  // Handle review incorrect answers
  const handleReviewIncorrect = () => {
    if (!isMounted.current) return;
    
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      showReview: true
    }));
    audioActions.playSoundEffect?.('control_click');
  };

  // Handle return from review
  const handleReturnFromReview = () => {
    if (!isMounted.current) return;
    
    setGameState(prev => ({
      ...prev,
      showReview: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect?.('control_click');
  };

  // Handle observational check completion
  const handleObservationalComplete = (answers) => {
    if (!isMounted.current) return;
    
    const points = answers.reduce((sum, answer) => sum + answer.points, 0);
    const regionId = gameState.selectedRegion.id;
    
    const fillBlankScore = gameState.fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
    const quizScore = gameState.quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
    const regionTotalScore = fillBlankScore + quizScore + points;
    
    const newCompletedRegions = [...new Set([...gameState.completedRegions, regionId])];
    const allRegionsCompleted = newCompletedRegions.length === game3Data.regions.length;
    
    // Save intermediate progress when region is completed
    const currentProgress = {
      completed: allRegionsCompleted,
      score: gameState.totalScore + points,
      maxScore: MAX_TOTAL_SCORE,
      completionDate: allRegionsCompleted ? new Date().toISOString() : null,
      completedRegions: newCompletedRegions,
      regionScores: {
        ...gameState.regionScores,
        [regionId]: regionTotalScore
      },
      timeElapsed: timeElapsed
    };
    
    // Save progress after each region completion
    if (playerActions.updatePlayerProgress) {
      playerActions.updatePlayerProgress('game3', currentProgress);
    }
    
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game3', progress: currentProgress }
    });
    
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
    
    // Play appropriate sound based on completion
    if (allRegionsCompleted) {
      audioActions.playSoundEffect?.('mission_complete');
      
      // Play victory music after a short delay - KEEP THIS
      const victoryTimeout = setTimeout(() => {
        if (isMounted.current && audioActions.playBackgroundMusic) {
          audioActions.playBackgroundMusic('victory');
        }
      }, 500);
      
      audioTimeouts.current.push(victoryTimeout);
    } else {
      audioActions.playSoundEffect?.('discovery_complete');
    }
  };

  // Handle continue to next region
  const handleContinueToNextRegion = () => {
    if (!isMounted.current) return;
    
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
      audioActions.playSoundEffect?.('telescope_scan');
    } else {
      completeGame();
    }
  };

  // Handle replay same region
  const handleReplayRegion = () => {
    if (!isMounted.current) return;
    
    resetRegionData();
    setGameState(prev => ({
      ...prev,
      currentStep: 2,
      showRegionComplete: false
    }));
    audioActions.playSoundEffect?.('reset_scan');
  };

  // Complete and save game
  const completeGame = () => {
    if (!isMounted.current) return;
    
    // Play mission complete sound
    audioActions.playSoundEffect?.('mission_complete');
    
    const finalProgress = {
      completed: true,
      score: gameState.totalScore,
      maxScore: MAX_TOTAL_SCORE,
      completionDate: new Date().toISOString(),
      completedRegions: gameState.completedRegions,
      regionScores: gameState.regionScores,
      timeElapsed: timeElapsed
    };

    console.log('Saving Game 3 progress:', finalProgress);

    // Update game state context
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game3', progress: finalProgress }
    });

    // Save to player context (which saves to IndexedDB)
    if (playerActions.updatePlayerProgress) {
      playerActions.updatePlayerProgress('game3', finalProgress);
    }

    // Delay onComplete callback to allow sound to play
    const completeTimeout = setTimeout(() => {
      if (isMounted.current && onComplete) {
        onComplete(finalProgress);
      }
    }, 500);
    
    audioTimeouts.current.push(completeTimeout);
  };

  // Handle back to map
  const handleBackToMap = () => {
    if (!isMounted.current) return;
    
    audioActions.playSoundEffect?.('control_click');
    
    const navTimeout = setTimeout(() => {
      if (isMounted.current) {
        gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
      }
    }, 200);
    
    audioTimeouts.current.push(navTimeout);
  };

  // Get current region's score
  const getCurrentRegionScore = () => {
    if (!gameState.selectedRegion) return 0;
    return gameState.regionScores[gameState.selectedRegion.id] || 0;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`season-navigator-root ${gameState.currentSeason}`}>
      {/* Celestial Background Overlay */}
      <div className={`season-overlay ${gameState.currentSeason}-overlay`}></div>
      
      {/* Telescope Focus Effect */}
      <div className="telescope-focus"></div>

      {/* Compact Header */}
      <div className="game3-header">
        <button onClick={handleBackToMap} className="back-button space-button">
          <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 3V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 6V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 6L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 21L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 21L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="button-text">Mission Map</span>
          <div className="back-btn-shine"></div>
        </button>

        
        <div className="header-content">
          <h1>SEASONAL NAVIGATOR</h1>
          <div className="header-subtitle">
            <span>⏱️ {formatTime(timeElapsed)}</span>
            <span>📍 {gameState.selectedRegion?.name || 'No Target'}</span>
            <span>★ {gameState.completedRegions.length}/{game3Data.regions.length}</span>
          </div>
        </div>
        <div className="header-spacer"></div>
      </div>

      {/* Compact Status Bar */}
      <CompactGameProgress 
        currentStep={gameState.currentStep}
        selectedRegion={gameState.selectedRegion}
        score={gameState.totalScore}
        completedRegions={gameState.completedRegions}
        totalRegions={game3Data.regions.length}
      />

      {/* Main Game Content */}
      <div className="game3-content">
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
              <h2>🌌 Mission Complete!</h2>
              <div className="completion-badge">
                <span className="badge-icon">🏆</span>
                <span className="badge-text">All Constellations Charted</span>
              </div>
              
              <div className="final-stats">
                <div className="stat-item large">
                  <span className="stat-label large">Total Energy</span>
                  <span className="stat-value large">{gameState.totalScore}/{MAX_TOTAL_SCORE}</span>
                </div>
                <div className="stat-item large">
                  <span className="stat-label large">Mission Time</span>
                  <span className="stat-value large">{formatTime(timeElapsed)}</span>
                </div>
                <div className="stat-item large">
                  <span className="stat-label large">Constellations</span>
                  <span className="stat-value large">
                    {gameState.completedRegions.length}/{game3Data.regions.length}
                  </span>
                </div>
              </div>
              
              <div className="region-scores-summary">
                <h3>Constellation Energy Readings</h3>
                <div className="scores-grid">
                  {game3Data.regions.map(region => (
                    <div key={region.id} className="region-score-card">
                      <span className="region-name">{region.name}</span>
                      <span className="region-score">
                        {gameState.regionScores[region.id] || 0}/{maxScorePerRegion} units
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="completion-buttons">
                <button 
                  onClick={completeGame} 
                  className="complete-mission-button"
                >
                  Complete Mission & Save Progress
                </button>
                <button 
                  onClick={handleBackToMap} 
                  className="continue-button secondary"
                >
                  Return to Mission Map (Unsaved)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3Root;