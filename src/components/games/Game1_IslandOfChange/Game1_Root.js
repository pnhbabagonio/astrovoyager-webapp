import React, { useState, useEffect } from 'react';
import { useGameState } from '../../../contexts/GameStateContext';
import { useAudio } from '../../../contexts/AudioContext';
import { usePlayer } from '../../../contexts/PlayerContext';
import RoleSelection from './components/RoleSelection/RoleSelection';
import ScenarioRunner from './components/ScenarioRunner/ScenarioRunner';
import ConsequenceView from './components/ConsequenceView/ConsequenceView';
import ResiliencePoints from './components/ResiliencePoints/ResiliencePoints';
import { game1Data } from '../../../data/game1Data';
import './Game1.css';

const Game1_Root = ({ onComplete }) => {
  const { dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();

  const [currentStage, setCurrentStage] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [gameProgress, setGameProgress] = useState({
    completedScenarios: [],
    totalResiliencePoints: 0,
    currentScenarioPoints: 0
  });
  const [lastChoiceResult, setLastChoiceResult] = useState(null);

  // Initialize game
  useEffect(() => {
    audioActions.playVoiceover('welcome');
    audioActions.playBackgroundMusic('adventure');
  }, [audioActions]);

  const handleRoleSelect = (role) => {
    audioActions.playSoundEffect('buttonClick');
    setSelectedRole(role);
    setCurrentStage('scenario');
    audioActions.playVoiceover('roleSelection');
  };

  const handleChoiceSelect = (choice) => {
    audioActions.playSoundEffect(choice.isCorrect ? 'success' : 'error');
    
    const result = {
      choice,
      isCorrect: choice.isCorrect,
      points: choice.resiliencePoints,
      consequence: choice.consequenceText,
      feedback: choice.feedback,
      geographyExplanation: game1Data.scenarios[currentScenarioIndex].geographyExplanation
    };

    setLastChoiceResult(result);

    // Update game progress
    const newPoints = gameProgress.totalResiliencePoints + choice.resiliencePoints;
    const updatedProgress = {
      ...gameProgress,
      totalResiliencePoints: newPoints,
      currentScenarioPoints: choice.resiliencePoints
    };

    if (choice.isCorrect) {
      updatedProgress.completedScenarios = [
        ...gameProgress.completedScenarios,
        game1Data.scenarios[currentScenarioIndex].id
      ];
    }

    setGameProgress(updatedProgress);
    setCurrentStage('consequence');
  };

  const handleNextScenario = () => {
    const nextIndex = currentScenarioIndex + 1;
    
    if (nextIndex < game1Data.scenarios.length) {
      setCurrentScenarioIndex(nextIndex);
      setCurrentStage('scenario');
      setLastChoiceResult(null);
      audioActions.playSoundEffect('buttonClick');
    } else {
      // Game completed
      completeGame();
    }
  };

  const handleRetryScenario = () => {
    setCurrentStage('scenario');
    setLastChoiceResult(null);
    audioActions.playSoundEffect('buttonClick');
  };

  const completeGame = () => {
    const finalScore = {
      completed: true,
      score: gameProgress.totalResiliencePoints,
      resiliencePoints: gameProgress.totalResiliencePoints,
      scenariosCompleted: gameProgress.completedScenarios.length,
      totalScenarios: game1Data.scenarios.length
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

    audioActions.playSoundEffect('success');
    audioActions.playBackgroundMusic('space');
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect('buttonClick');
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const currentScenario = game1Data.scenarios[currentScenarioIndex];

  return (
    <div className="game1-root">
      <div className="game1-header">
        <button onClick={handleBackToMap} className="back-button">
          ← Back to Map
        </button>
        <h1>🌋 Island of Change</h1>
        <ResiliencePoints points={gameProgress.totalResiliencePoints} />
      </div>

      <div className="game1-content">
        {currentStage === 'role-selection' && (
          <RoleSelection 
            roles={game1Data.roles}
            onRoleSelect={handleRoleSelect}
          />
        )}

        {currentStage === 'scenario' && selectedRole && currentScenario && (
          <ScenarioRunner
            scenario={currentScenario}
            role={selectedRole}
            onChoiceSelect={handleChoiceSelect}
            scenarioNumber={currentScenarioIndex + 1}
            totalScenarios={game1Data.scenarios.length}
          />
        )}

        {currentStage === 'consequence' && lastChoiceResult && (
          <ConsequenceView
            result={lastChoiceResult}
            role={selectedRole}
            scenario={currentScenario}
            onNext={handleNextScenario}
            onRetry={handleRetryScenario}
            isLastScenario={currentScenarioIndex === game1Data.scenarios.length - 1}
          />
        )}
      </div>

      <div className="game1-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentScenarioIndex + (currentStage === 'consequence' ? 1 : 0)) / game1Data.scenarios.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="progress-text">
          Scenario {Math.min(currentScenarioIndex + 1, game1Data.scenarios.length)} of {game1Data.scenarios.length}
        </div>
      </div>
    </div>
  );
};

export default Game1_Root;