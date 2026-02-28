import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ totalScore, maxScore, fillBlankAnswers, quizAnswers, hasIncorrect, onProceed, onReview }) => {
  const fillBlankScore = fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const quizScore = quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const totalMaxScore = 40 + 90;

  return (
    <div className="game3-scoreboard">
      <div className="game3-analysis-report-header">
        <h2><span className="game3-scoreboard-icon">📊</span> Observatory Analysis Report</h2>
        <p className="game3-report-subtitle">Mission performance assessment</p>
      </div>

      <div className="game3-mission-analysis-report">
        <div className="game3-mission-score">
          <h3>Mission Efficiency Score</h3>
          <div className="game3-score-number">{totalScore}<span>/{totalMaxScore}</span></div>
          <div className="game3-efficiency-rating">
            {Math.round((totalScore / totalMaxScore) * 100)}% Efficiency
          </div>
        </div>

        <div className="game3-system-analysis">
          <h4>System Performance Analysis</h4>
          <div className="game3-analysis-item">
            <div className="game3-system">
              <span className="game3-system-icon">📡</span>
              <span>Data Analysis System</span>
            </div>
            <span className="game3-performance">{fillBlankScore}/40</span>
          </div>
          <div className="game3-analysis-item">
            <div className="game3-system">
              <span className="game3-system-icon">🌌</span>
              <span>Navigation System</span>
            </div>
            <span className="game3-performance">{quizScore}/90</span>
          </div>
        </div>

        <div className={hasIncorrect ? 'game3-anomaly-detection' : 'game3-mission-success'}>
          <p>
            {hasIncorrect ? (
              <>
                <span>⚠️</span>
                Anomalies detected in navigation data. Review recommended.
              </>
            ) : (
              <>
                <span>✅</span>
                All systems operating optimally. Proceed to observation.
              </>
            )}
          </p>
        </div>

        <div className="game3-mission-control">
          {hasIncorrect && (
            <button onClick={onReview} className="game3-review-anomalies-button">
              Review Anomalies
            </button>
          )}
          <button onClick={onProceed} className="game3-proceed-mission-button">
            Continue Mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;