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

const Game3_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();
  
  const startTimeRef = useRef(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
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

  // Initialize timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('welcome_celestial_observatory');
    audioActions.playBackgroundMusic('celestial_exploration');
  }, [audioActions]);

  // Update season based on selected region
  useEffect(() => {
    if (gameState.selectedRegion) {
      setGameState(prev => ({
        ...prev,
        currentSeason: gameState.selectedRegion.currentSeason.toLowerCase()
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
    const isReplaying = gameState.completedRegions.includes(region.id);
    
    setGameState(prev => ({
      ...prev,
      selectedRegion: region,
      currentStep: isReplaying ? 5 : 2,
      showRegionComplete: isReplaying
    }));
    
    audioActions.playSoundEffect('telescope_focus');
    
    if (isReplaying) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentStep: 2,
          showRegionComplete: false
        }));
      }, 1000);
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
    
    audioActions.playSoundEffect('data_analysis_complete');
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
    
    audioActions.playSoundEffect('warp_complete');
  };

  // Handle proceed after scoreboard
  const handleProceedToObservational = () => {
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect('control_click');
  };

  // Handle review incorrect answers
  const handleReviewIncorrect = () => {
    setGameState(prev => ({
      ...prev,
      showScoreboard: false,
      showReview: true
    }));
    audioActions.playSoundEffect('control_click');
  };

  // Handle return from review
  const handleReturnFromReview = () => {
    setGameState(prev => ({
      ...prev,
      showReview: false,
      currentStep: 4
    }));
    audioActions.playSoundEffect('control_click');
  };

  // Handle observational check completion
const handleObservationalComplete = (answers) => {
  const points = answers.reduce((sum, answer) => sum + answer.points, 0);
  const regionId = gameState.selectedRegion.id;
  
  const fillBlankScore = gameState.fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const quizScore = gameState.quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const regionTotalScore = fillBlankScore + quizScore + points;
  
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
    
    audioActions.playSoundEffect('discovery_complete');
    
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
      audioActions.playSoundEffect('telescope_scan');
    } else {
      completeGame();
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
    audioActions.playSoundEffect('reset_scan');
  };

  // Complete and save game
  const completeGame = () => {
    // Optional: Add a confirmation effect
    audioActions.playSoundEffect('mission_complete');
    
    const finalScore = {
      completed: true,
      totalScore: gameState.totalScore,
      regionScores: gameState.regionScores,
      completedRegions: gameState.completedRegions,
      timeElapsed: timeElapsed,
      dateCompleted: new Date().toISOString()
    };

    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game3', progress: finalScore }
    });

    playerActions.updatePlayerProgress('game3', finalScore);

    if (onComplete) {
      onComplete(finalScore);
    }
  };

  // Handle back to map
  const handleBackToMap = () => {
    audioActions.playSoundEffect('control_click');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
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
        <button
          onClick={handleBackToMap}
          className="back-button"
          aria-label="Return to mission map"
        >
          <span className="back-text">Back to Mission Map</span>
        </button>

        
        <div className="header-content">
          <h1>🔭 Seasonal Navigator</h1>
          <div className="header-subtitle">
            <span>⏱️ {formatTime(timeElapsed)}</span>
            <span>📍 {gameState.selectedRegion?.name || 'No Target'}</span>
            <span>★ {gameState.completedRegions.length}/{game3Data.regions.length}</span>
          </div>
        </div>   
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
                    <span className="stat-value large">{gameState.totalScore}</span>
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
                          {gameState.regionScores[region.id] || 0} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* ADD THESE TWO BUTTONS */}
                <div className="completion-buttons">
                  <button 
                    onClick={completeGame} 
                    className="complete-mission-button"
                  >
                    Complete Mission & Return to Map
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

export default Game3_Root;