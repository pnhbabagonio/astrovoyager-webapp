import React from 'react';
import './ReviewIncorrectAnswers.css';

const ReviewIncorrectAnswers = ({ incorrectAnswers, scenarios, onReturn }) => {
  const getScenario = (scenarioId) => {
    return scenarios.find(s => s.id === scenarioId);
  };

  return (
    <div className="review-incorrect">
      <div className="review-header">
        <h2>📝 Review Incorrect Answers</h2>
        <p className="subtitle">Learn from your mistakes before proceeding.</p>
      </div>

      <div className="review-content">
        {incorrectAnswers.length === 0 ? (
          <p className="no-incorrect">No incorrect answers to review!</p>
        ) : (
          incorrectAnswers.map((answer, index) => {
            const scenario = getScenario(answer.scenarioId);
            const selectedOption = scenario.options.find(opt => opt.id === answer.selectedOptionId);
            const correctOption = scenario.options.find(opt => opt.correct);

            return (
              <div key={index} className="review-item">
                <h3>Scenario {index + 1}</h3>
                <p className="question">{scenario.question}</p>
                
                <div className="answer-comparison">
                  <div className="answer wrong-answer">
                    <span className="label">Your Answer:</span>
                    <span className="text">{selectedOption.text}</span>
                  </div>
                  <div className="answer correct-answer">
                    <span className="label">Correct Answer:</span>
                    <span className="text">{correctOption.text}</span>
                  </div>
                </div>

                <div className="explanation">
                  <h4>Explanation:</h4>
                  <p>{scenario.explanation}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="review-controls">
        <button onClick={onReturn} className="return-button">
          Return to Scoreboard
        </button>
      </div>
    </div>
  );
};

export default ReviewIncorrectAnswers;