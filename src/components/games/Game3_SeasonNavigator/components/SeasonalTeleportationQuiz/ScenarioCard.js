import React from 'react';
import './SeasonalTeleportationQuiz.css';

const ScenarioCard = ({ scenario, selectedOptionId, showResult, onOptionSelect }) => {
  return (
    <div className="scenario-card">
      <div className="scenario-image">
        <img src={scenario.image} alt="Scenario" />
        <div className="image-overlay">Teleportation Scenario</div>
      </div>
      
      <div className="scenario-question">
        <h3>{scenario.question}</h3>
      </div>

      <div className="options">
        {scenario.options.map(option => {
          let optionClass = 'option';
          if (selectedOptionId === option.id) {
            optionClass += ' selected';
          }
          if (showResult) {
            if (option.correct) {
              optionClass += ' correct';
            } else if (selectedOptionId === option.id && !option.correct) {
              optionClass += ' incorrect';
            }
          }

          return (
            <div
              key={option.id}
              className={optionClass}
              onClick={() => onOptionSelect(option.id)}
            >
              <span className="option-letter">{option.id.toUpperCase()}</span>
              <span className="option-text">{option.text}</span>
              {showResult && option.correct && (
                <span className="checkmark">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioCard;