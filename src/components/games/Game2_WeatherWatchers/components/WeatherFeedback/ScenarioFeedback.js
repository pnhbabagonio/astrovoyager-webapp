import React from 'react';
import './WeatherFeedback.css';

const ScenarioFeedback = ({ result }) => {
  const { scenario, selectedChoices, points, correctChoices, explanation } = result;

  return (
    <div className="scenario-feedback">
      <div className="feedback-header">
        <div className="result-icon">
          {points > 0 ? '✅' : '❌'}
        </div>
        <h2>
          {points === 10 ? 'Perfect!' : points > 0 ? 'Good Job!' : 'Needs Improvement'}
        </h2>
      </div>

      <div className="feedback-content">
        <div className="scenario-summary">
          <div className="points-earned">
            {points > 0 ? (
              <div className="points-positive">
                +{points} Preparedness Points!
              </div>
            ) : (
              <div className="points-negative">
                No points earned
              </div>
            )}
          </div>

          <div className="score-explanation">
            {explanation}
          </div>
        </div>

        <div className="choices-review">
          <h3>Your Choices:</h3>
          <div className="choices-list">
            {scenario.choices.map((choice, index) => {
              const wasSelected = selectedChoices.includes(choice);
              const isCorrect = choice.correct;
              
              return (
                <div 
                  key={index}
                  className={`choice-review ${wasSelected ? 'selected' : ''} ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="choice-status">
                    {wasSelected ? (isCorrect ? '✓' : '✗') : ''}
                  </div>
                  <div className="choice-text">{choice.text}</div>
                  <div className="choice-explanation">
                    {choice.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioFeedback;