import React, { useEffect, useState } from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({ score, maxScore, location, onRetry }) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Animate score counting up
    const duration = 1500; // milliseconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = score / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(score, Math.floor(increment * currentStep));
      setDisplayedScore(newScore);

      if (newScore === score) {
        clearInterval(timer);
        if (score >= maxScore / 2) {
          setShowCelebration(true);
        }
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score, maxScore]);

  const getScorePercentage = () => {
    return (score / maxScore) * 100;
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    
    if (percentage === 100) {
      return {
        title: "Perfect! 🎉",
        message: "You completely understand Earth's tilt and daylight changes!",
        color: "#28c896"
      };
    } else if (percentage >= 70) {
      return {
        title: "Excellent! 🌟",
        message: "Great understanding of how Earth's tilt affects daylight!",
        color: "#4a7dff"
      };
    } else if (percentage >= 50) {
      return {
        title: "Good Job! 👍",
        message: "You understand the basics of Earth's tilt!",
        color: "#ffd166"
      };
    } else {
      return {
        title: "Keep Learning! 📚",
        message: "Review how Earth's tilt affects different locations.",
        color: "#ff9966"
      };
    }
  };

  const getLocationSpecificTip = () => {
    if (!location) return "Try different locations to see different patterns!";
    
    const tips = {
      'Philippines': 'Near the equator, day length changes are minimal throughout the year.',
      'Canada': 'Northern locations experience extreme day length variations between seasons.',
      'Australia': 'Southern hemisphere locations have opposite seasons to the north.'
    };
    
    return tips[location] || "The closer to the poles, the more extreme the day length changes.";
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="score-display">
      <div className="score-header">
        <h2>🎯 Mission Complete!</h2>
        <p className="mission-summary">
          You explored how Earth's tilt affects daylight in {location || "your chosen location"}
        </p>
      </div>

      <div className="score-card">
        <div className="score-visual">
          <div className="score-circle">
            <svg className="score-ring" viewBox="0 0 36 36">
              <path
                className="ring-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="ring-progress"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{
                  strokeDasharray: `${getScorePercentage()}, 100`
                }}
              />
            </svg>
            <div className="score-center">
              <span className="score-number">{displayedScore}</span>
              <span className="score-total">/{maxScore}</span>
            </div>
          </div>
        </div>

        <div className="score-details">
          <h3 style={{ color: scoreMessage.color }}>{scoreMessage.title}</h3>
          <p className="score-message">{scoreMessage.message}</p>
          
          <div className="score-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Correct Answers:</span>
              <span className="breakdown-value">{score} out of {maxScore}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Percentage:</span>
              <span className="breakdown-value">{Math.round(getScorePercentage())}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Location:</span>
              <span className="breakdown-value">{location || "Not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>
      )}

      <div className="knowledge-summary">
        <h4>🌍 What You Learned:</h4>
        <div className="knowledge-points">
          <div className="point">
            <span className="point-icon">🌐</span>
            <div className="point-content">
              <h5>Earth's Tilt Matters</h5>
              <p>The 23.5° tilt causes seasons and changing day lengths.</p>
            </div>
          </div>
          <div className="point">
            <span className="point-icon">🌡️</span>
            <div className="point-content">
              <h5>Not About Distance</h5>
              <p>Seasons aren't caused by Earth being closer to the Sun.</p>
            </div>
          </div>
          <div className="point">
            <span className="point-icon">📍</span>
            <div className="point-content">
              <h5>Location Affects Daylight</h5>
              <p>{getLocationSpecificTip()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="retry-button" onClick={onRetry}>
          🔄 Try Another Location
        </button>
        <button className="review-button" onClick={() => window.location.reload()}>
          📖 Review Concepts
        </button>
      </div>

      <div className="mission-encouragement">
        <p>🎯 <strong>Remember:</strong> Understanding Earth's tilt helps us understand weather patterns, seasons, and climate around the world!</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;