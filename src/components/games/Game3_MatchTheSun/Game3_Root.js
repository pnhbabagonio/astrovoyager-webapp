import React, { useState, useEffect } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import SeasonMatcher from './components/SeasonMatcher/SeasonMatcher';
import QuickActionChallenge from './components/QuickActionChallenge/QuickActionChallenge';
import SeasonalFeedback from './components/SeasonalFeedback/SeasonalFeedback';
import AccuracyPoints from './components/AccuracyPoints/AccuracyPoints';
import { game3Data } from '../../../data/game3Data';
import './Game3.css';

const Game3_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();

  const [currentStage, setCurrentStage] = useState('season-matcher');
  const [gameProgress, setGameProgress] = useState({
    completedSeasons: [],
    totalAccuracyPoints: 0,
    currentPoints: 0,
    timeBonuses: 0
  });
  const [currentSeason, setCurrentSeason] = useState(null);
  const [matchingResult, setMatchingResult] = useState(null);
  const [quickActionResult, setQuickActionResult] = useState(null);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('welcome');
    audioActions.playBackgroundMusic('adventure');
  }, [audioActions]);

  const handleSunPlacement = (season, isCorrect, timeBonus = 0) => {
    const basePoints = isCorrect ? 15 : 0;
    const totalPoints = basePoints + timeBonus;

    const result = {
      season,
      isCorrect,
      basePoints,
      timeBonus,
      totalPoints,
      explanation: season.explanation
    };

    setMatchingResult(result);
    setCurrentSeason(season);

    // Update progress
    const newPoints = gameProgress.totalAccuracyPoints + totalPoints;
    const updatedProgress = {
      ...gameProgress,
      totalAccuracyPoints: newPoints,
      currentPoints: totalPoints,
      timeBonuses: gameProgress.timeBonuses + timeBonus
    };

    if (isCorrect) {
      updatedProgress.completedSeasons = [
        ...gameProgress.completedSeasons,
        season.id
      ];
    }

    setGameProgress(updatedProgress);
    setCurrentStage('matching-feedback');

    audioActions.playSoundEffect(isCorrect ? 'success' : 'error');
  };

  const handleMatchingContinue = () => {
    if (matchingResult.isCorrect) {
      setCurrentStage('quick-action');
      setMatchingResult(null);
    } else {
      setCurrentStage('season-matcher');
      setMatchingResult(null);
      setCurrentSeason(null);
    }
    audioActions.playSoundEffect('buttonClick');
  };

  const handleQuickActionComplete = (result) => {
    setQuickActionResult(result);

    // Update progress
    const newPoints = gameProgress.totalAccuracyPoints + result.points;
    const updatedProgress = {
      ...gameProgress,
      totalAccuracyPoints: newPoints,
      currentPoints: result.points
    };

    setGameProgress(updatedProgress);
    setCurrentStage('action-feedback');

    audioActions.playSoundEffect(result.points > 0 ? 'success' : 'error');
  };

  const handleActionContinue = () => {
    setCurrentStage('season-matcher');
    setQuickActionResult(null);
    setCurrentSeason(null);
    audioActions.playSoundEffect('buttonClick');

    // Check if all seasons are completed
    if (gameProgress.completedSeasons.length >= game3Data.seasons.length) {
      completeGame();
    }
  };

  const completeGame = () => {
    const finalScore = {
      completed: true,
      score: gameProgress.totalAccuracyPoints,
      accuracyPoints: gameProgress.totalAccuracyPoints,
      timeBonuses: gameProgress.timeBonuses,
      seasonsCompleted: gameProgress.completedSeasons.length,
      totalSeasons: game3Data.seasons.length
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

    audioActions.playSoundEffect('success');
    audioActions.playBackgroundMusic('space');
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const getRemainingSeasons = () => {
    return game3Data.seasons.filter(season => 
      !gameProgress.completedSeasons.includes(season.id)
    );
  };

  return (
    <div className="game3-root">
      <div className="game3-header">
        <button onClick={handleBackToMap} className="back-button">
          ← Back to Map
        </button>
        <h1>☀️ Match the Sun</h1>
        <AccuracyPoints 
          points={gameProgress.totalAccuracyPoints} 
          bonuses={gameProgress.timeBonuses}
        />
      </div>

      <div className="game3-content">
        {currentStage === 'season-matcher' && (
          <SeasonMatcher
            seasons={getRemainingSeasons()}
            onSunPlacement={handleSunPlacement}
            completedSeasons={gameProgress.completedSeasons}
          />
        )}

        {currentStage === 'matching-feedback' && matchingResult && (
          <SeasonalFeedback
            type="matching"
            result={matchingResult}
            onContinue={handleMatchingContinue}
          />
        )}

        {currentStage === 'quick-action' && currentSeason && (
          <QuickActionChallenge
            season={currentSeason}
            onComplete={handleQuickActionComplete}
          />
        )}

        {currentStage === 'action-feedback' && quickActionResult && (
          <SeasonalFeedback
            type="action"
            result={quickActionResult}
            onContinue={handleActionContinue}
          />
        )}
      </div>

      <div className="game3-progress">
        <div className="progress-info">
          <span>Seasons Matched: {gameProgress.completedSeasons.length}/{game3Data.seasons.length}</span>
          <span>Time Bonuses: +{gameProgress.timeBonuses} points</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(gameProgress.completedSeasons.length / game3Data.seasons.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Game3_Root;