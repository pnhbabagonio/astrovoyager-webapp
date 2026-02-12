import React, { useEffect, useState } from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({ 
  score, 
  maxScore, 
  location, 
  locationProgress,
  allLocationsCompleted,
  showFinalScore,
  onTryAnotherLocation,
  onCompleteAllLocations 
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showContinueOptions, setShowContinueOptions] = useState(false);

  useEffect(() => {
    // Animate score counting up
    const duration = 1500;
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
        // Show continue options after animation
        setTimeout(() => {
          setShowContinueOptions(true);
        }, 500);
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

  const getCompletedLocationsCount = () => {
    return Object.values(locationProgress).filter(loc => loc.completed).length;
  };

  const getTotalScore = () => {
    return Object.values(locationProgress).reduce((sum, loc) => sum + loc.score, 0);
  };

  const getLocationSpecificTip = () => {
    if (!location) return "Try different locations to see different patterns!";
    
    const tips = {
      'Philippines': 'Near the equator, day length changes are minimal throughout the year.',
      'Canada': 'Northern locations experience extreme day length variations between seasons.',
      'Australia': 'Southern hemisphere locations have opposite seasons to the north.'
    };
    
    return tips[location.name] || "The closer to the poles, the more extreme the day length changes.";
  };

  const scoreMessage = getScoreMessage();

  const handleContinue = () => {
    if (allLocationsCompleted) {
      onCompleteAllLocations();
    } else {
      onTryAnotherLocation();
    }
  };

  return (
    <div className="score-display">
      {showFinalScore && allLocationsCompleted ? (
        // Final Score Display (All Locations Completed)
        <>
          <div className="score-header">
            <h2>🎉 Mission Complete! All Locations Explored!</h2>
            <p className="mission-summary">
              You've discovered how Earth's tilt affects daylight around the world!
            </p>
          </div>

          <div className="final-summary">
            <div className="final-score-card">
              <div className="final-score-visual">
                <div className="final-score-circle">
                  <div className="final-score-number">{getTotalScore()}</div>
                  <div className="final-score-label">out of 9 points</div>
                  <div className="final-score-percentage">
                    {Math.round((getTotalScore() / 9) * 100)}% Mastery
                  </div>
                </div>
              </div>
              
              <div className="final-score-details">
                <h3 style={{ color: '#ffd166' }}>Master Astronomer! 🌟</h3>
                <p className="final-message">
                  You've successfully explored all three locations and understand how Earth's tilt creates different daylight patterns around the world!
                </p>
                
                <div className="location-scores-summary">
                  <h4>Your Location Scores:</h4>
                  {Object.entries(locationProgress).map(([locId, progress]) => {
                    const locName = locationsData.find(l => l.id === locId)?.name;
                    return (
                      <div key={locId} className="location-score-item">
                        <span className="location-name">
                          {locId === 'ph' ? '🏝️' : locId === 'ca' ? '🍁' : '🦘'} {locName}
                        </span>
                        <div className="score-bar-container">
                          <div 
                            className="score-bar-fill"
                            style={{ width: `${(progress.score / 3) * 100}%` }}
                          ></div>
                          <span className="score-bar-text">{progress.score}/3</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="final-achievements">
            <h4>🏆 Achievements Unlocked:</h4>
            <div className="achievements-grid">
              <div className="achievement">
                <span className="achievement-icon">🌐</span>
                <h5>Global Explorer</h5>
                <p>Observed all 3 locations</p>
              </div>
              <div className="achievement">
                <span className="achievement-icon">🎯</span>
                <h5>Tilt Master</h5>
                <p>Understood Earth's axial tilt</p>
              </div>
              <div className="achievement">
                <span className="achievement-icon">🌍</span>
                <h5>Daylight Detective</h5>
                <p>Analyzed daylight patterns</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="complete-mission-button" onClick={handleContinue}>
              🚀 Complete Mission & Return to Map
            </button>
          </div>

          <div className="mission-complete-message">
            <p>🎯 <strong>Mission Accomplished!</strong> You now understand how Earth's tilt creates seasons and affects daylight hours around the world!</p>
          </div>
        </>
      ) : (
        // Individual Location Score Display
        <>
          <div className="score-header">
            <h2><span className="header-emoji">🎯</span> Location Complete!</h2>
            <p className="mission-summary">
              You explored how Earth's tilt affects daylight in {location?.name}
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
                  <span className="breakdown-label">Location:</span>
                  <span className="breakdown-value">{location?.name}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Your Score:</span>
                  <span className="breakdown-value">{score} out of {maxScore}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Percentage:</span>
                  <span className="breakdown-value">{Math.round(getScorePercentage())}%</span>
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

          {showContinueOptions && (
            <div className="continue-options">
              <div className="mission-progress-summary">
                <div className="progress-summary-item">
                  <span className="progress-label">Mission Progress:</span>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${(getCompletedLocationsCount() / 3) * 100}%` }}
                    ></div>
                    <span className="progress-text">
                      {getCompletedLocationsCount()} of 3 Locations
                    </span>
                  </div>
                </div>
                <div className="progress-summary-item">
                  <span className="progress-label">Total Score:</span>
                  <span className="progress-value">{getTotalScore()}/9 points</span>
                </div>
              </div>

              {allLocationsCompleted ? (
                <div className="complete-mission-section">
                  <h4>🎉 All Locations Completed!</h4>
                  <p>You've explored all three locations! Ready to complete the mission?</p>
                  <button className="complete-all-button" onClick={handleContinue}>
                    🚀 Complete Mission
                  </button>
                </div>
              ) : (
                <div className="next-location-section">
                  <h4>🌍 Explore Another Location</h4>
                  <p>Continue exploring to understand how Earth's tilt affects different parts of the world.</p>
                  <button className="try-another-button" onClick={handleContinue}>
                    🔄 Try Another Location
                  </button>
                  <button 
                    className="review-button"
                    onClick={() => onTryAnotherLocation()}
                  >
                    📖 Review {location?.name} Again
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Need to import locationsData for final display
const locationsData = [
  { id: 'ph', name: 'Philippines' },
  { id: 'ca', name: 'Canada' },
  { id: 'au', name: 'Australia' }
];

export default ScoreDisplay;