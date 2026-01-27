import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ totalScore, maxScore, fillBlankAnswers, quizAnswers, hasIncorrect, onProceed, onReview }) => {
  const fillBlankScore = fillBlankAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const quizScore = quizAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  const totalMaxScore = 40 + 90;

  return (
    <div className="scoreboard">
      <div className="analysis-report-header">
        <h2>📊 Observatory Analysis Report</h2>
        <p className="report-subtitle">Mission performance assessment</p>
      </div>

      <div className="mission-analysis-report">
        <div className="mission-score">
          <h3>Mission Efficiency Score</h3>
          <div className="score-number">{totalScore}<span>/{totalMaxScore}</span></div>
          <div className="efficiency-rating">
            {Math.round((totalScore / totalMaxScore) * 100)}% Efficiency
          </div>
        </div>

        <div className="system-analysis">
          <h4>System Performance Analysis</h4>
          <div className="analysis-item">
            <div className="system">
              <span className="system-icon">📡</span>
              <span>Data Analysis System</span>
            </div>
            <span className="performance">{fillBlankScore}/40</span>
          </div>
          <div className="analysis-item">
            <div className="system">
              <span className="system-icon">🌌</span>
              <span>Navigation System</span>
            </div>
            <span className="performance">{quizScore}/90</span>
          </div>
        </div>

        <div className={hasIncorrect ? 'anomaly-detection' : 'mission-success'}>
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

        <div className="mission-control">
          {hasIncorrect && (
            <button onClick={onReview} className="review-anomalies-button">
              Review Anomalies
            </button>
          )}
          <button onClick={onProceed} className="proceed-mission-button">
            Continue Mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;