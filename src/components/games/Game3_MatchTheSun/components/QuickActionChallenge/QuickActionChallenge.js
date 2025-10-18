import React, { useState, useEffect } from 'react';
import { getQuickActionsForSeason } from '../../../../../data/game3Data';
import TimerDisplay from './TimerDisplay';
import ActionGrid from './ActionGrid';
import './QuickActionChallenge.css';

const QuickActionChallenge = ({ season, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [actions, setActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [gameState, setGameState] = useState('playing'); // playing, completed

  useEffect(() => {
    const quickActions = getQuickActionsForSeason(season.id);
    // Shuffle actions for variety
    const shuffledActions = [...quickActions].sort(() => Math.random() - 0.5);
    setActions(shuffledActions);
    setTimeRemaining(30);
    setGameState('playing');
  }, [season]);

  useEffect(() => {
    if (timeRemaining > 0 && gameState === 'playing') {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [timeRemaining, gameState]);

  const handleActionSelect = (action) => {
    if (gameState !== 'playing') return;

    if (selectedActions.includes(action)) {
      // Deselect if already selected
      setSelectedActions(selectedActions.filter(a => a !== action));
    } else {
      // Select new action
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleSubmit = () => {
    if (selectedActions.length === 0) return;

    const correctActions = actions.filter(action => action.isCorrect);
    const selectedCorrect = selectedActions.filter(action => action.isCorrect);
    
    const basePoints = Math.round((selectedCorrect.length / correctActions.length) * 10);
    const timeBonus = Math.floor(timeRemaining / 3);
    const totalPoints = basePoints + timeBonus;

    const isPerfect = selectedCorrect.length === correctActions.length && 
                     selectedActions.length === correctActions.length;

    const result = {
      season,
      selectedActions,
      basePoints,
      timeBonus,
      totalPoints,
      isPerfect,
      correctActions: correctActions,
      timeRemaining,
      explanation: `You selected ${selectedCorrect.length} out of ${correctActions.length} correct actions with ${timeRemaining}s remaining.`
    };

    setGameState('completed');
    onComplete(result);
  };

  const handleTimeUp = () => {
    const correctActions = actions.filter(action => action.isCorrect);
    const selectedCorrect = selectedActions.filter(action => action.isCorrect);
    
    const basePoints = Math.round((selectedCorrect.length / correctActions.length) * 10);
    const totalPoints = basePoints; // No time bonus

    const result = {
      season,
      selectedActions,
      basePoints,
      timeBonus: 0,
      totalPoints,
      isPerfect: false,
      correctActions: correctActions,
      timeRemaining: 0,
      explanation: `Time's up! You selected ${selectedCorrect.length} out of ${correctActions.length} correct actions.`
    };

    setGameState('completed');
    onComplete(result);
  };

  return (
    <div className="quick-action-challenge">
      <div className="challenge-header">
        <div className="season-badge" style={{ backgroundColor: season.color }}>
          {season.name} Quick Actions
        </div>
        <h2>Rapid Response Challenge</h2>
        <TimerDisplay 
          timeRemaining={timeRemaining}
          totalTime={30}
        />
      </div>

      <div className="challenge-content">
        <div className="challenge-instructions">
          <p>Select the correct actions for <strong>{season.name}</strong> before time runs out!</p>
          <p>Time Bonus: +{Math.floor(timeRemaining / 3)} points for speed!</p>
        </div>

        <ActionGrid 
          actions={actions}
          selectedActions={selectedActions}
          onActionSelect={handleActionSelect}
          disabled={gameState !== 'playing'}
        />

        <div className="challenge-actions">
          <button 
            onClick={handleSubmit}
            disabled={selectedActions.length === 0 || gameState !== 'playing'}
            className="submit-button"
          >
            Submit Answers
          </button>
          <div className="selection-info">
            Selected: {selectedActions.length} action(s) | Time: {timeRemaining}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionChallenge;