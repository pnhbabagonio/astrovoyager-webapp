import React from 'react';
import './ScenarioRunner.css';

const ChoicesGrid = ({ choices, onChoiceSelect }) => {
  return (
    <div className="choices-grid">
      <h3 className="choices-title">What will you do?</h3>
      <p className="choices-instruction">Choose the best action for your role:</p>
      
      <div className="choices-container">
        {choices.map(choice => (
          <button
            key={choice.id}
            className="choice-button"
            onClick={() => onChoiceSelect(choice)}
          >
            <span className="choice-text">{choice.choiceText}</span>
            <span className="choice-points">+{choice.resiliencePoints} points</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoicesGrid;