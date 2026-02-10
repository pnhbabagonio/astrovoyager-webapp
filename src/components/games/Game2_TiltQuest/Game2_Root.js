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
    position: 50, // Start at equinox (50%)
    season: 'equinox'
  });
  
  // Track progress for all locations
  const [locationProgress, setLocationProgress] = useState({
    ph: { completed: false, score: 0, observation: null, concept1: null, concept2: null },
    ca: { completed: false, score: 0, observation: null, concept1: null, concept2: null },
    au: { completed: false, score: 0, observation: null, concept1: null, concept2: null }
  });
  
  const [currentLocationScore, setCurrentLocationScore] = useState(0);
  const [allLocationsCompleted, setAllLocationsCompleted] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('astro-welcome');
    audioActions.playBackgroundMusic('space-theme');
  }, [audioActions]);

  // Check if all locations are completed
  useEffect(() => {
    const completed = Object.values(locationProgress).every(loc => loc.completed);
    setAllLocationsCompleted(completed);
    
    // Calculate total score
    const totalScore = Object.values(locationProgress).reduce((sum, loc) => sum + loc.score, 0);
    
    // If all completed and we're in final stage, show final score
    if (completed && currentStage === 'score-display' && !showFinalScore) {
      setTimeout(() => {
        setShowFinalScore(true);
      }, 2000);
    }
  }, [locationProgress, currentStage, showFinalScore]);

  const handleLocationSelect = (location) => {
    // Don't allow selecting already completed locations
    if (locationProgress[location.id].completed) {
      audioActions.playSoundEffect('error');
      return;
    }
    
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
    // Update progress for current location
    setLocationProgress(prev => ({
      ...prev,
      [selectedLocation.id]: {
        ...prev[selectedLocation.id],
        observation: observationAnswer
      }
    }));
    
    audioActions.playSoundEffect('buttonClick');
    setTimeout(() => {
      setCurrentStage('concept-check');
    }, 500);
  };

  const handleConceptComplete = (conceptAnswers) => {
    // Calculate score for this location
    let calculatedScore = 0;
    
    // Check observation (simplified logic - would be based on actual observation)
    const observationCorrect = true; // In real app, check if observation matches Earth state
    if (observationCorrect) calculatedScore += 1;
    
    // Check concept answers
    if (conceptAnswers.concept1 === 'days-change') calculatedScore += 1;
    if (conceptAnswers.concept2 === 'earth-tilted') calculatedScore += 1;
    
    // Get current observation before updating state
    const currentObservation = locationProgress[selectedLocation.id].observation;
    
    // Update location progress
    setLocationProgress(prev => ({
      ...prev,
      [selectedLocation.id]: {
        ...prev[selectedLocation.id],
        completed: true,
        score: calculatedScore,
        concept1: conceptAnswers.concept1,
        concept2: conceptAnswers.concept2
      }
    }));
    
    setCurrentLocationScore(calculatedScore);
    setCurrentStage('score-display');
    
    // Save progress for this location immediately
    const locationResult = {
      gameName: 'game2_location',
      locationId: selectedLocation.id,
      completed: true,
      score: calculatedScore,
      maxScore: 3,
      details: {
        observation: currentObservation,
        concept1: conceptAnswers.concept1,
        concept2: conceptAnswers.concept2
      },
      completionDate: new Date().toISOString()
    };
    
    playerActions.updatePlayerProgress('game2', locationResult);
    
    audioActions.playSoundEffect(calculatedScore > 0 ? 'success' : 'error');
  };

  const handleTryAnotherLocation = () => {
    setSelectedLocation(null);
    setEarthState({ tilt: false, position: 50, season: 'equinox' });
    setCurrentLocationScore(0);
    setShowFinalScore(false);
    setCurrentStage('location-selector');
    audioActions.playSoundEffect('reset');
  };

  const handleCompleteAllLocations = () => {
    const totalScore = Object.values(locationProgress).reduce((sum, loc) => sum + loc.score, 0);
    const maxScore = 9; // 3 locations * 3 points each
    const now = new Date().toISOString();
    
    // Create properly structured game progress data
    const gameResult = {
      completed: true,
      score: totalScore,
      maxScore: maxScore,
      locationsCompleted: Object.values(locationProgress).filter(loc => loc.completed).length,
      details: locationProgress,
      date: now,
      // Ensure all required fields for IndexedDB are present
      completionDate: now // This is required for the IndexedDB index
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game2', progress: gameResult }
    });

    // Save to player progress - ensure proper structure
    playerActions.updatePlayerProgress('game2', gameResult);

    // Call completion callback
    if (onComplete) {
      onComplete(gameResult);
    }
    
    audioActions.playSoundEffect('success');
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const getCompletedCount = () => {
    return Object.values(locationProgress).filter(loc => loc.completed).length;
  };

  const getTotalScore = () => {
    return Object.values(locationProgress).reduce((sum, loc) => sum + loc.score, 0);
  };

  const getProgressForLocation = (locationId) => {
    return locationProgress[locationId];
  };

  return (
    <div className="astro-game-root">
      <div className="astro-header">
        <button onClick={handleBackToMap} className="astro-back-button">
          Back to Mission Map
        </button>
        <div className="astro-title">
          <h1>🌌 ASTROVOYAGER – TILTQUEST</h1>
          <p className="subtitle">Discover how Earth's tilt affects daylight!</p>
        </div>
        <div className="astro-score">
          <span className="score-label">Total Progress:</span>
          <span className="score-value">{getCompletedCount()}/3 Locations</span>
          <span className="score-total">Score: {getTotalScore()}/9</span>
        </div>
      </div>

      <div className="astro-content">
        {currentStage === 'location-selector' && (
          <LocationSelector
            locations={locationsData}
            onSelectLocation={handleLocationSelect}
            locationProgress={locationProgress}
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

        {currentStage === 'score-display' && selectedLocation && (
          <ScoreDisplay
            score={currentLocationScore}
            maxScore={3}
            location={selectedLocation}
            locationProgress={locationProgress}
            allLocationsCompleted={allLocationsCompleted}
            showFinalScore={showFinalScore}
            onTryAnotherLocation={handleTryAnotherLocation}
            onCompleteAllLocations={handleCompleteAllLocations}
          />
        )}
      </div>

      <div className="astro-progress">
        <div className="progress-steps">
          <div className={`step ${['location-selector', 'earth-visualization', 'observation-check', 'concept-check', 'score-display'].includes(currentStage) ? 'active' : ''} ${currentStage === 'location-selector' ? 'current' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-name">Select Location</span>
          </div>
          <div className={`step ${['earth-visualization', 'observation-check', 'concept-check', 'score-display'].includes(currentStage) ? 'active' : ''} ${currentStage === 'earth-visualization' ? 'current' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-name">Explore Earth</span>
          </div>
          <div className={`step ${['observation-check', 'concept-check', 'score-display'].includes(currentStage) ? 'active' : ''} ${currentStage === 'observation-check' ? 'current' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-name">Observation</span>
          </div>
          <div className={`step ${['concept-check', 'score-display'].includes(currentStage) ? 'active' : ''} ${currentStage === 'concept-check' ? 'current' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-name">Concept Check</span>
          </div>
        </div>
        
        <div className="location-progress-summary">
          <div className="location-tags">
            {locationsData.map(loc => {
              const progress = getProgressForLocation(loc.id);
              return (
                <div 
                  key={loc.id}
                  className={`location-tag ${progress.completed ? 'completed' : ''} ${selectedLocation?.id === loc.id ? 'current' : ''}`}
                  title={`${loc.name}: ${progress.completed ? `Score: ${progress.score}/3` : 'Not completed'}`}
                >
                  <span className="tag-icon">
                    {loc.id === 'ph' ? '🏝️' : loc.id === 'ca' ? '🍁' : '🦘'}
                  </span>
                  <span className="tag-name">{loc.name}</span>
                  {progress.completed && (
                    <span className="tag-score">✓ {progress.score}/3</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2_Root;