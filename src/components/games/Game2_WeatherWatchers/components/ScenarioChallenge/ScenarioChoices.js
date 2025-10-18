import React from 'react';
import './ScenarioChallenge.css';

const ScenarioChoices = ({ choices, selectedChoices, onChoiceSelect }) => {
  return (
    <div className="scenario-choices">
      <div className="choices-grid">
        {choices.map((choice, index) => (
          <div
            key={index}
            className={`choice-card ${selectedChoices.includes(choice) ? 'selected' : ''} ${choice.correct ? 'correct-option' : 'incorrect-option'}`}
            onClick={() => onChoiceSelect(choice)}
          >
            <div className="choice-checkbox">
              {selectedChoices.includes(choice) ? '✓' : ''}
            </div>
            <div className="choice-text">{choice.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioChoices;