import React, { useState, useEffect } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import LocationSelector from './components/LocationSelector/LocationSelector';
import EarthVisualization from './components/EarthVisualization/EarthVisualization';
import ObservationCheck from './components/ObservationCheck/ObservationCheck';
import ConceptCheck from './components/ConceptCheck/ConceptCheck';
import ScoreDisplay from './components/ScoreDisplay/ScoreDisplay';
import { locationsData, conceptQuestions } from './data/astroVoyagerData';
import './Game2.css';

const Game2_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();

  const [currentStage, setCurrentStage] = useState('location-selector');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [earthState, setEarthState] = useState({
    tilt: false,
    position: 0, // 0-100 slider position
    season: 'equinox' // equinox, summer-solstice, winter-solstice
  });
  const [answers, setAnswers] = useState({
    observation: null,
    concept1: null,
    concept2: null
  });
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('astro-welcome');
    audioActions.playBackgroundMusic('space-theme');
  }, [audioActions]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    audioActions.playSoundEffect('select');
    setTimeout(() => {
      setCurrentStage('earth-visualization');
    }, 500);
  };

  const handleEarthStateUpdate = (newState) => {
    setEarthState(newState);
  };

  const handleObservationComplete = (observationAnswer) => {
    setAnswers(prev => ({ ...prev, observation: observationAnswer }));
    audioActions.playSoundEffect('buttonClick');
    setTimeout(() => {
      setCurrentStage('concept-check');
    }, 500);
  };

  const handleConceptComplete = (conceptAnswers) => {
    setAnswers(prev => ({ ...prev, ...conceptAnswers }));
    
    // Calculate score (1 point each for correct answers)
    let calculatedScore = 0;
    
    // Observation check scoring (simplified - in real app, would check against correct answer)
    if (answers.observation) calculatedScore += 1;
    
    // Concept check scoring
    if (conceptAnswers.concept1 === 'days-change') calculatedScore += 1;
    if (conceptAnswers.concept2 === 'earth-tilted') calculatedScore += 1;
    
    setScore(calculatedScore);
    setGameComplete(true);
    audioActions.playSoundEffect(calculatedScore > 0 ? 'success' : 'error');
    
    // Update global progress after delay
    setTimeout(() => {
      completeGame(calculatedScore);
    }, 2000);
  };

  const completeGame = (finalScore) => {
    const gameResult = {
      completed: true,
      score: finalScore,
      maxScore: 3, // 3 possible points
      location: selectedLocation?.name,
      date: new Date().toISOString()
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game2', progress: gameResult }
    });

    // Save to player progress
    playerActions.updatePlayerProgress('game2', gameResult);

    // Call completion callback
    if (onComplete) {
      onComplete(gameResult);
    }
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const resetGame = () => {
    setSelectedLocation(null);
    setEarthState({ tilt: false, position: 0, season: 'equinox' });
    setAnswers({ observation: null, concept1: null, concept2: null });
    setScore(0);
    setGameComplete(false);
    setCurrentStage('location-selector');
    audioActions.playSoundEffect('reset');
  };

  return (
    <div className="astro-game-root">
      <div className="astro-header">
        <button onClick={handleBackToMap} className="astro-back-button">
          ← Back to Mission Map
        </button>
        <div className="astro-title">
          <h1>🌌 ASTROVOYAGER – TILTQUEST</h1>
          <p className="subtitle">Discover how Earth's tilt affects daylight!</p>
        </div>
        <div className="astro-score">
          <span className="score-label">Mission Points:</span>
          <span className="score-value">{score}/3</span>
        </div>
      </div>

      <div className="astro-content">
        {currentStage === 'location-selector' && (
          <LocationSelector
            locations={locationsData}
            onSelectLocation={handleLocationSelect}
          />
        )}

        {currentStage === 'earth-visualization' && selectedLocation && (
          <EarthVisualization
            location={selectedLocation}
            earthState={earthState}
            onUpdateEarthState={handleEarthStateUpdate}
            onProceed={() => setCurrentStage('observation-check')}
          />
        )}

        {currentStage === 'observation-check' && selectedLocation && (
          <ObservationCheck
            location={selectedLocation}
            earthState={earthState}
            onComplete={handleObservationComplete}
          />
        )}

        {currentStage === 'concept-check' && (
          <ConceptCheck
            questions={conceptQuestions}
            onComplete={handleConceptComplete}
          />
        )}

        {gameComplete && (
          <ScoreDisplay
            score={score}
            maxScore={3}
            location={selectedLocation?.name}
            onRetry={resetGame}
          />
        )}
      </div>

      <div className="astro-progress">
        <div className="progress-steps">
          <div className={`step ${currentStage === 'location-selector' ? 'active' : ''} ${currentStage === 'location-selector' ? 'current' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-name">Select Location</span>
          </div>
          <div className={`step ${currentStage === 'earth-visualization' ? 'active' : ''} ${currentStage === 'earth-visualization' ? 'current' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-name">Explore Earth</span>
          </div>
          <div className={`step ${currentStage === 'observation-check' ? 'active' : ''} ${currentStage === 'observation-check' ? 'current' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-name">Observation</span>
          </div>
          <div className={`step ${currentStage === 'concept-check' || gameComplete ? 'active' : ''} ${currentStage === 'concept-check' ? 'current' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-name">Concept Check</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2_Root;