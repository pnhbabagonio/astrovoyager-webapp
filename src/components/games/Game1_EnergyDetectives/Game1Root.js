import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import CharacterSelection from './components/CharacterSelection/CharacterSelection';
import ScenarioRunner from './components/ScenarioRunner/ScenarioRunner';
import FeedbackView from './components/FeedbackView/FeedbackView';
import Scoreboard from './components/Scoreboard/Scoreboard';
import ReflectionView from './components/ReflectionView/ReflectionView';
import { game1Data } from '../../../data/game1Data';
import './Game1.css';

const Game1Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();

  const [currentStage, setCurrentStage] = useState('character-selection');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choicesHistory, setChoicesHistory] = useState([]);
  const [lastChoiceFeedback, setLastChoiceFeedback] = useState(null);
  const [currentReflectionIndex, setCurrentReflectionIndex] = useState(0);
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  // Ref to track audio timeouts for cleanup
  const audioTimeouts = useRef([]);

  // Clear all audio timeouts helper
  const clearAllTimeouts = () => {
    audioTimeouts.current.forEach(timeout => clearTimeout(timeout));
    audioTimeouts.current = [];
  };

  // Initialize game
  useEffect(() => {
    isMounted.current = true;
    
    // Play background music when game starts
    if (audioActions.playBackgroundMusic) {
      audioActions.playBackgroundMusic('adventure');
    }
    
    // NO VOICEOVER HERE - removed welcome_astro

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearAllTimeouts();
      // Don't stop background music here - let App.js handle it
    };
  }, [audioActions]);

  const handleCharacterSelect = (character) => {
    if (!isMounted.current) return;
    
    audioActions.playSoundEffect?.('buttonClick');
    setSelectedCharacter(character);
    setCurrentStage('scenario');
    
    // NO VOICEOVER HERE - removed character_selected
  };

  const handleChoiceSelect = (choice, scenarioId) => {
    if (!isMounted.current) return;
    
    // audioActions.playSoundEffect?.(choice.isCorrect ? 'success' : 'error');
    
    // Update score if correct
    if (choice.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Store choice in history
    const choiceRecord = {
      scenarioId,
      choice,
      isCorrect: choice.isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setChoicesHistory(prev => [...prev, choiceRecord]);
    
    // Show feedback for this choice
    setLastChoiceFeedback({
      choice,
      isCorrect: choice.isCorrect,
      explanation: choice.explanation
    });
    
    setCurrentStage('feedback');
  };

  const handleNextAfterFeedback = () => {
    if (!isMounted.current) return;
    
    const nextScenarioIndex = currentScenarioIndex + 1;
    
    if (nextScenarioIndex < game1Data.scenarios.length) {
      setCurrentScenarioIndex(nextScenarioIndex);
      setCurrentStage('scenario');
      setLastChoiceFeedback(null);
      audioActions.playSoundEffect?.('buttonClick');
    } else {
      // All scenarios completed - show scoreboard
      setCurrentStage('scoreboard');
      audioActions.playSoundEffect?.('level_complete');
    }
  };

  const handleNextReflection = () => {
    if (!isMounted.current) return;
    
    const nextReflectionIndex = currentReflectionIndex + 1;
    
    if (nextReflectionIndex < game1Data.reflectionQuestions.length) {
      setCurrentReflectionIndex(nextReflectionIndex);
      audioActions.playSoundEffect?.('buttonClick');
    } else {
      // All reflections shown - complete game
      completeGame();
    }
  };

  const handleStartReflection = () => {
    if (!isMounted.current) return;
    
    setCurrentStage('reflection');
    audioActions.playSoundEffect?.('buttonClick');
  };

  const completeGame = () => {
    if (!isMounted.current) return;
    
    const finalScore = {
      completed: true,
      score: score,
      maxScore: game1Data.scenarios.length,
      character: selectedCharacter?.name || 'Unknown',
      choicesHistory: choicesHistory,
      completionDate: new Date().toISOString()
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game1', progress: finalScore }
    });

    // Save to player progress
    if (playerActions.updatePlayerProgress) {
      playerActions.updatePlayerProgress('game1', finalScore);
    }

    // Play completion sounds
    audioActions.playSoundEffect?.('game_complete');
    
    // Small delay before changing music to avoid overlap
    const victoryTimeout = setTimeout(() => {
      if (isMounted.current && audioActions.playBackgroundMusic) {
        audioActions.playBackgroundMusic('victory');
      }
    }, 300);
    
    audioTimeouts.current.push(victoryTimeout);

    // Call completion callback
    if (onComplete) {
      onComplete(finalScore);
    }
  };

  const handleBackToMap = () => {
    if (!isMounted.current) return;
    
    audioActions.playSoundEffect?.('buttonClick');
    
    const navTimeout = setTimeout(() => {
      if (isMounted.current) {
        gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
      }
    }, 200);
    
    audioTimeouts.current.push(navTimeout);
  };

  const currentScenario = game1Data.scenarios[currentScenarioIndex];
  const currentReflectionQuestion = game1Data.reflectionQuestions[currentReflectionIndex];
  
  // Calculate progress percentage safely
  const progressPercentage = game1Data.scenarios.length > 1 
    ? (currentScenarioIndex / (game1Data.scenarios.length - 1)) * 100 
    : 100;

  return (
    <div className="game1-root solar-voyager-theme">
      <div className="game1-header">
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

        <div className="header-center">
          <div className="mission-title">
            <div className="title-row">
              <h1>SOLAR VOYAGER</h1>
            </div>
            <div className="mission-subtitle">
              <span>⏱️ Mission {Math.min(currentScenarioIndex + 1, game1Data.scenarios.length)}/{game1Data.scenarios.length}</span>
              <span>⭐ Score: {score}/{game1Data.scenarios.length}</span>
            </div>
          </div>
        </div>

        <div className="header-spacer"></div>
      </div>

      <div className="game1-content">
        {currentStage === 'character-selection' && (
          <CharacterSelection 
            characters={game1Data.characters}
            onCharacterSelect={handleCharacterSelect}
          />
        )}

        {currentStage === 'scenario' && selectedCharacter && currentScenario && (
          <ScenarioRunner
            scenario={currentScenario}
            character={selectedCharacter}
            onChoiceSelect={(choice) => handleChoiceSelect(choice, currentScenario.id)}
            scenarioNumber={currentScenarioIndex + 1}
            totalScenarios={game1Data.scenarios.length}
          />
        )}

        {currentStage === 'feedback' && lastChoiceFeedback && currentScenario && (
          <FeedbackView
            feedback={lastChoiceFeedback}
            scenario={currentScenario}
            onNext={handleNextAfterFeedback}
            isLastScenario={currentScenarioIndex === game1Data.scenarios.length - 1}
          />
        )}

        {currentStage === 'scoreboard' && (
          <Scoreboard
            score={score}
            totalQuestions={game1Data.scenarios.length}
            character={selectedCharacter}
            onContinue={handleStartReflection}
          />
        )}

        {currentStage === 'reflection' && (
          <ReflectionView
            question={currentReflectionQuestion}
            questionNumber={currentReflectionIndex + 1}
            totalQuestions={game1Data.reflectionQuestions.length}
            onNext={handleNextReflection}
            isLastQuestion={currentReflectionIndex === game1Data.reflectionQuestions.length - 1}
          />
        )}
      </div>

      {/* Progress Bar */}
      <div className="game1-progress space-panel">
        <div className="solar-progress">
          <div className="progress-label">
            {currentStage === 'reflection' 
              ? `Reflection Log ${currentReflectionIndex + 1}/${game1Data.reflectionQuestions.length}`
              : `Mission ${Math.min(currentScenarioIndex + 1, game1Data.scenarios.length)}/${game1Data.scenarios.length}`
            }
          </div>
          <div className="progress-track">
            <div 
              className="progress-beam sun-glow"
              style={{ 
                width: `${progressPercentage}%` 
              }}
            >
              <div className="beam-core"></div>
              <div className="beam-glow"></div>
            </div>
            <div className="progress-markers">
              {Array.from({ length: game1Data.scenarios.length }).map((_, i) => (
                <div 
                  key={i} 
                  className={`progress-marker ${i <= currentScenarioIndex ? 'active' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game1Root;