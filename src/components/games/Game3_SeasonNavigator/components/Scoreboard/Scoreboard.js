import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ totalScore, maxScore, fillBlankAnswers, quizAnswers, hasIncorrect, onProceed, onReview }) => {
  const fillBlankScore = fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const quizScore = quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const totalMaxScore = 40 + 90; // 40 from fillBlank, 90 from quiz

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>📊 Scoreboard</h2>
        <p className="subtitle">Your performance so far</p>
      </div>

      <div className="score-display">
        <div className="total-score">
          <h3>Total Score</h3>
          <div className="score-number">{totalScore}<span>/{totalMaxScore}</span></div>
          <div className="score-percentage">
            {Math.round((totalScore / totalMaxScore) * 100)}%
          </div>
        </div>

        <div className="breakdown">
          <div className="breakdown-item">
            <span className="label">Fill-in-the-Blanks:</span>
            <span className="value">{fillBlankScore}/40</span>
          </div>
          <div className="breakdown-item">
            <span className="label">Teleportation Quiz:</span>
            <span className="value">{quizScore}/90</span>
          </div>
        </div>

        <div className="incorrect-info">
          {hasIncorrect ? (
            <p>You have some incorrect answers. You can review them before proceeding.</p>
          ) : (
            <p>Great job! All answers are correct.</p>
          )}
        </div>

        <div className="scoreboard-controls">
          {hasIncorrect && (
            <button onClick={onReview} className="review-button">
              Review Incorrect Answers
            </button>
          )}
          <button onClick={onProceed} className="proceed-button">
            Proceed to Observational Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;