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

  // Game state
  const [gameState, setGameState] = useState({
    currentStep: 1, // 1: Region, 2: FillBlanks, 3: Quiz, 4: Observational, 5: RegionComplete
    selectedRegion: null,
    completedRegions: [],
    regionScores: {}, // Store scores per region {regionId: score}
    fillBlankAnswers: [],
    quizAnswers: [],
    observationalAnswers: [],
    totalScore: 0,
    showScoreboard: false,
    showReview: false,
    showRegionComplete: false,
    allRegionsCompleted: false
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
    audioActions.playVoiceover('welcome_season_navigator');
    audioActions.playBackgroundMusic('space_exploration');
  }, [audioActions]);

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
      currentStep: isReplaying ? 5 : 2, // If replaying, show completion screen
      showRegionComplete: isReplaying
    }));
    
    audioActions.playSoundEffect('teleport');
    
    // If replaying, show the region completion screen with previous score
    if (isReplaying) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentStep: 2, // Start the game for this region
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
    
    audioActions.playSoundEffect('success');
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
      setTimeout(() => {
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
    audioActions.playSoundEffect('restart');
  };

  // Complete and save game (when all regions done)
  const completeGame = () => {
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
    if (onComplete) {
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

  return (
    <div className="season-navigator-root">
      <div className="game3-header">
        <button onClick={handleBackToMap} className="back-button">
          ← Back to Map
        </button>
        <div className="header-content">
          <h1>🌎 Season Navigator</h1>
          <div className="header-subtitle">
            <span>Selected Region: {gameState.selectedRegion?.name || 'None'}</span>
            <span>Regions Completed: {gameState.completedRegions.length}/{game3Data.regions.length}</span>
            <span>Time: {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="total-score-display">
          <span className="score-label">Total Score</span>
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
              <h2>🎉 Mission Complete!</h2>
              <div className="completion-badge">
                <span className="badge-icon">🏆</span>
                <span className="badge-text">All Regions Explored!</span>
              </div>
              
              <div className="final-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Score</span>
                  <span className="stat-value">{gameState.totalScore}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time</span>
                  <span className="stat-value">
                    {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Regions</span>
                  <span className="stat-value">
                    {gameState.completedRegions.length}/{game3Data.regions.length}
                  </span>
                </div>
              </div>
              
              <div className="region-scores-summary">
                <h3>Region Scores</h3>
                <div className="scores-grid">
                  {game3Data.regions.map(region => (
                    <div key={region.id} className="region-score-card">
                      <span className="region-name">{region.name}</span>
                      <span className="region-score">
                        {gameState.regionScores[region.id] || 0} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button onClick={handleBackToMap} className="continue-button">
                Return to Mission Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3_Root;