import React, { useState, useEffect, useRef } from 'react';
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

const Game2Root = ({ onComplete }) => {
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
  
  // Refs for audio and mounted state
  const isMounted = useRef(true);
  const audioTimeouts = useRef([]);

  // Clear all audio timeouts helper
  const clearAllTimeouts = () => {
    audioTimeouts.current.forEach(timeout => clearTimeout(timeout));
    audioTimeouts.current = [];
  };

  // Initialize game
  useEffect(() => {
    isMounted.current = true;
    
    // Play background music - use 'adventure' for game music
    if (audioActions.playBackgroundMusic) {
      audioActions.playBackgroundMusic('adventure');
    }
    
    // Delay voiceover to avoid overlapping with music
    const voiceoverTimeout = setTimeout(() => {
      if (isMounted.current && audioActions.playVoiceover) {
        audioActions.playVoiceover('astro-welcome');
      }
    }, 800);
    
    audioTimeouts.current.push(voiceoverTimeout);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearAllTimeouts();
      // Don't stop background music - let App.js handle it
    };
  }, [audioActions]);

  // Check if all locations are completed
  useEffect(() => {
    const completed = Object.values(locationProgress).every(loc => loc.completed);
    setAllLocationsCompleted(completed);
    
    // If all completed and we're in final stage, show final score
    if (completed && currentStage === 'score-display' && !showFinalScore && isMounted.current) {
      const scoreTimeout = setTimeout(() => {
        if (isMounted.current) {
          setShowFinalScore(true);
          // Play success sound for completing all locations
          audioActions.playSoundEffect?.('success');
        }
      }, 2000);
      
      audioTimeouts.current.push(scoreTimeout);
    }
  }, [locationProgress, currentStage, showFinalScore, audioActions]);

  const handleLocationSelect = (location) => {
    if (!isMounted.current) return;
    
    // Don't allow selecting already completed locations
    if (locationProgress[location.id].completed) {
      audioActions.playSoundEffect?.('error');
      return;
    }
    
    setSelectedLocation(location);
    audioActions.playSoundEffect?.('select');
    
    const stageTimeout = setTimeout(() => {
      if (isMounted.current) {
        setCurrentStage('earth-visualization');
      }
    }, 500);
    
    audioTimeouts.current.push(stageTimeout);
  };

  const handleEarthStateUpdate = (newState) => {
    if (!isMounted.current) return;
    setEarthState(newState);
  };

  const handleObservationComplete = (observationAnswer) => {
    if (!isMounted.current) return;
    
    // Update progress for current location
    setLocationProgress(prev => ({
      ...prev,
      [selectedLocation.id]: {
        ...prev[selectedLocation.id],
        observation: observationAnswer
      }
    }));
    
    audioActions.playSoundEffect?.('buttonClick');
    
    const stageTimeout = setTimeout(() => {
      if (isMounted.current) {
        setCurrentStage('concept-check');
      }
    }, 500);
    
    audioTimeouts.current.push(stageTimeout);
  };

  const handleConceptComplete = (conceptAnswers) => {
    if (!isMounted.current) return;
    
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
    
    if (playerActions.updatePlayerProgress) {
      playerActions.updatePlayerProgress('game2', locationResult);
    }
    
    // Play appropriate sound effect
    // audioActions.playSoundEffect?.(calculatedScore > 0 ? 'success' : 'error');
  };

  const handleTryAnotherLocation = () => {
    if (!isMounted.current) return;
    
    setSelectedLocation(null);
    setEarthState({ tilt: false, position: 50, season: 'equinox' });
    setCurrentLocationScore(0);
    setShowFinalScore(false);
    setCurrentStage('location-selector');
    audioActions.playSoundEffect?.('reset');
  };

  const handleCompleteAllLocations = () => {
    if (!isMounted.current) return;
    
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
    if (playerActions.updatePlayerProgress) {
      playerActions.updatePlayerProgress('game2', gameResult);
    }

    // Play success sound
    // audioActions.playSoundEffect?.('success');
    
    // Small delay before calling onComplete to allow sound to play
    const completeTimeout = setTimeout(() => {
      if (isMounted.current && onComplete) {
        onComplete(gameResult);
      }
    }, 300);
    
    audioTimeouts.current.push(completeTimeout);
  };

  const handleBackToMap = () => {
    if (!isMounted.current) return;
    
    audioActions.playSoundEffect?.('buttonClick');
    
    // Small delay before navigation to allow sound to play
    const navTimeout = setTimeout(() => {
      if (isMounted.current) {
        gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
      }
    }, 200);
    
    audioTimeouts.current.push(navTimeout);
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
          <span className="back-icon">←</span>
          Back to Mission Map
        </button>
        <div className="astro-title">
          <h1>ASTROVOYAGER – TILTQUEST</h1>
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
            onProceed={() => {
              if (isMounted.current) {
                audioActions.playSoundEffect?.('buttonClick');
                setCurrentStage('observation-check');
              }
            }}
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

export default Game2Root;