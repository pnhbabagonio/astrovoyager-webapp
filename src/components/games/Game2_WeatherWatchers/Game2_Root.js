import React, { useState, useEffect } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import MapInterface from './components/MapInterface/MapInterface';
import ScenarioChallenge from './components/ScenarioChallenge/ScenarioChallenge';
import WeatherFeedback from './components/WeatherFeedback/WeatherFeedback';
import PreparednessPoints from './components/PreparednessPoints/PreparednessPoints';
import { game2Data } from '../../../data/game2Data';
import './Game2.css';

const Game2_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();

  const [currentStage, setCurrentStage] = useState('map-interface');
  const [gameProgress, setGameProgress] = useState({
    placedPhenomena: [],
    completedScenarios: [],
    totalPreparednessPoints: 0,
    currentPoints: 0
  });
  const [currentPhenomenon, setCurrentPhenomenon] = useState(null);
  const [placementResult, setPlacementResult] = useState(null);
  const [scenarioResult, setScenarioResult] = useState(null);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('welcome');
    audioActions.playBackgroundMusic('adventure');
  }, [audioActions]);

  const handlePhenomenonPlacement = (phenomenon, region) => {
    const isCorrect = phenomenon.correctRegion === region.name;
    const points = isCorrect ? 15 : 0;

    const result = {
      phenomenon,
      region,
      isCorrect,
      points,
      explanation: phenomenon.explanation,
      facts: phenomenon.formationFacts
    };

    setPlacementResult(result);
    setCurrentPhenomenon(phenomenon);

    // Update progress
    const newPoints = gameProgress.totalPreparednessPoints + points;
    const updatedProgress = {
      ...gameProgress,
      totalPreparednessPoints: newPoints,
      currentPoints: points,
      placedPhenomena: [...gameProgress.placedPhenomena, { phenomenon, region, correct: isCorrect }]
    };

    setGameProgress(updatedProgress);
    setCurrentStage('placement-feedback');

    audioActions.playSoundEffect(isCorrect ? 'success' : 'error');
  };

  const handlePlacementContinue = () => {
    if (placementResult.isCorrect) {
      setCurrentStage('scenario-challenge');
      setPlacementResult(null);
    } else {
      setCurrentStage('map-interface');
      setPlacementResult(null);
      setCurrentPhenomenon(null);
    }
    audioActions.playSoundEffect('buttonClick');
  };

  const handleScenarioComplete = (result) => {
    setScenarioResult(result);

    // Update progress
    const newPoints = gameProgress.totalPreparednessPoints + result.points;
    const updatedProgress = {
      ...gameProgress,
      totalPreparednessPoints: newPoints,
      currentPoints: result.points,
      completedScenarios: [...gameProgress.completedScenarios, currentPhenomenon.id]
    };

    setGameProgress(updatedProgress);
    setCurrentStage('scenario-feedback');

    audioActions.playSoundEffect(result.points > 0 ? 'success' : 'error');
  };

  const handleScenarioContinue = () => {
    setCurrentStage('map-interface');
    setScenarioResult(null);
    setCurrentPhenomenon(null);
    audioActions.playSoundEffect('buttonClick');

    // Check if all phenomena are completed
    if (gameProgress.placedPhenomena.length >= game2Data.phenomena.length) {
      completeGame();
    }
  };

  const completeGame = () => {
    const finalScore = {
      completed: true,
      score: gameProgress.totalPreparednessPoints,
      preparednessPoints: gameProgress.totalPreparednessPoints,
      phenomenaPlaced: gameProgress.placedPhenomena.length,
      totalPhenomena: game2Data.phenomena.length
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game2', progress: finalScore }
    });

    // Save to player progress
    playerActions.updatePlayerProgress('game2', finalScore);

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

  const getRemainingPhenomena = () => {
    const placedIds = gameProgress.placedPhenomena.map(p => p.phenomenon.id);
    return game2Data.phenomena.filter(p => !placedIds.includes(p.id));
  };

  return (
    <div className="game2-root">
      <div className="game2-header">
        <button onClick={handleBackToMap} className="back-button">
          ← Back to Map
        </button>
        <h1>🌦️ Weather Watchers</h1>
        <PreparednessPoints points={gameProgress.totalPreparednessPoints} />
      </div>

      <div className="game2-content">
        {currentStage === 'map-interface' && (
          <MapInterface
            phenomena={getRemainingPhenomena()}
            placedPhenomena={gameProgress.placedPhenomena}
            onPhenomenonPlacement={handlePhenomenonPlacement}
            regions={game2Data.mapRegions}
          />
        )}

        {currentStage === 'placement-feedback' && placementResult && (
          <WeatherFeedback
            type="placement"
            result={placementResult}
            onContinue={handlePlacementContinue}
          />
        )}

        {currentStage === 'scenario-challenge' && currentPhenomenon && (
          <ScenarioChallenge
            phenomenon={currentPhenomenon}
            onComplete={handleScenarioComplete}
          />
        )}

        {currentStage === 'scenario-feedback' && scenarioResult && (
          <WeatherFeedback
            type="scenario"
            result={scenarioResult}
            onContinue={handleScenarioContinue}
          />
        )}
      </div>

      <div className="game2-progress">
        <div className="progress-info">
          <span>Phenomena Placed: {gameProgress.placedPhenomena.length}/{game2Data.phenomena.length}</span>
          <span>Scenarios Completed: {gameProgress.completedScenarios.length}/{game2Data.phenomena.length}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(gameProgress.placedPhenomena.length / game2Data.phenomena.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Game2_Root;