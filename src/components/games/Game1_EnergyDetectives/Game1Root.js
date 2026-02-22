import React, { useState, useEffect } from 'react';
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

  // Initialize game
  useEffect(() => {
    audioActions.playBackgroundMusic('space');
    audioActions.playVoiceover('welcome_astro');
  }, [audioActions]);

  const handleCharacterSelect = (character) => {
    audioActions.playSoundEffect('buttonClick');
    setSelectedCharacter(character);
    setCurrentStage('scenario');
    audioActions.playVoiceover('character_selected');
  };

  const handleChoiceSelect = (choice, scenarioId) => {
    audioActions.playSoundEffect(choice.isCorrect ? 'success' : 'error');
    
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
    const nextScenarioIndex = currentScenarioIndex + 1;
    
    if (nextScenarioIndex < game1Data.scenarios.length) {
      setCurrentScenarioIndex(nextScenarioIndex);
      setCurrentStage('scenario');
      setLastChoiceFeedback(null);
      audioActions.playSoundEffect('buttonClick');
    } else {
      // All scenarios completed - show scoreboard
      setCurrentStage('scoreboard');
      audioActions.playSoundEffect('level_complete');
    }
  };

  const handleNextReflection = () => {
    const nextReflectionIndex = currentReflectionIndex + 1;
    
    if (nextReflectionIndex < game1Data.reflectionQuestions.length) {
      setCurrentReflectionIndex(nextReflectionIndex);
      audioActions.playSoundEffect('buttonClick');
    } else {
      // All reflections shown - complete game
      completeGame();
    }
  };

  const handleStartReflection = () => {
    setCurrentStage('reflection');
    audioActions.playSoundEffect('buttonClick');
  };

  const completeGame = () => {
    const finalScore = {
      completed: true,
      score: score,
      maxScore: game1Data.scenarios.length,
      character: selectedCharacter.name,
      choicesHistory: choicesHistory,
      completionDate: new Date().toISOString()
    };

    // Update global progress
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: 'game1', progress: finalScore }
    });

    // Save to player progress
    playerActions.updatePlayerProgress('game1', finalScore);

    // Call completion callback
    if (onComplete) {
      onComplete(finalScore);
    }

    audioActions.playSoundEffect('game_complete');
    audioActions.playBackgroundMusic('victory');
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const currentScenario = game1Data.scenarios[currentScenarioIndex];
  const currentReflectionQuestion = game1Data.reflectionQuestions[currentReflectionIndex];

  return (
    <div className="game1-root solar-voyager-theme">
      <div className="game1-header">
        <button onClick={handleBackToMap} className="back-button space-button">
          <span className="button-text">Back to Mission Map</span>
        </button>

        <div className="header-center">
          <div className="mission-title">
            <div className="title-row">
              <h1>SOLAR VOYAGER</h1>
            </div>
            <div className="mission-subtitle">
              <span>⏱️ {/* Add timer if you want */}Mission {Math.min(currentScenarioIndex + 1, game1Data.scenarios.length)}/{game1Data.scenarios.length}</span>
              <span>⭐ Score: {score}/{game1Data.scenarios.length}</span>
              {selectedCharacter && <span>🚀 {selectedCharacter.name}</span>}
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

      {/* UPDATED PROGRESS BAR */}
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
                width: `${(currentScenarioIndex / (game1Data.scenarios.length - 1)) * 100}%` 
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