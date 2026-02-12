import React, { useState } from 'react';
import './ObservationCheck.css';

const ObservationCheck = ({ location, earthState, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const observationOptions = [
    { id: 'longer', label: 'Day is longer', icon: '🌞', value: 'longer' },
    { id: 'shorter', label: 'Day is shorter', icon: '🌙', value: 'shorter' },
    { id: 'same', label: 'Day stays almost the same', icon: '⚖️', value: 'same' }
  ];

  const handleAnswerSelect = (answerId) => {
    if (!isSubmitted) {
      // Toggle selection - if already selected, unselect it
      if (selectedAnswer === answerId) {
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(answerId);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
      onComplete(selectedAnswer);
    }
  };

  return (
    <div className="observation-check">
      <div className="check-header">
        <h2><span className="header-emoji">👁️</span> Observation Check</h2>
        <p className="check-instruction">
          Based on your observation of <strong>{location.name}</strong>, 
          what happens to the day length when Earth's tilt is ON?
        </p>
      </div>

      <div className="observation-summary">
        <div className="summary-card">
          <h3>Your Current Observation</h3>
          <div className="summary-details">
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{location.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Earth's Tilt:</span>
              <span className="detail-value">{earthState.tilt ? 'ON (23.5°)' : 'OFF (0°)'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Season:</span>
              <span className="detail-value">
                {earthState.season === 'summer-solstice-north' ? 'Summer Solstice' : 
                 earthState.season === 'winter-solstice-north' ? 'Winter Solstice' : 
                 'Equinox'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="observation-options">
        <h3>Select what you observed:</h3>
        
        <div className="options-grid">
          {observationOptions.map((option) => (
            <div
              key={option.id}
              className={`option-card ${selectedAnswer === option.id ? 'selected' : ''} ${isSubmitted ? 'submitted' : ''}`}
              onClick={() => handleAnswerSelect(option.id)}
            >
              <div className="option-icon">
                {option.icon}
              </div>
              <div className="option-content">
                <h4>{option.label}</h4>
                <p className="option-description">
                  {option.id === 'longer' && 'Sunlight lasts longer than 12 hours'}
                  {option.id === 'shorter' && 'Sunlight lasts shorter than 12 hours'}
                  {option.id === 'same' && 'Approximately equal day and night'}
                </p>
              </div>
              <div className="option-selector">
                {selectedAnswer === option.id ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="check-footer">
          <button 
            className={`submit-button ${!selectedAnswer ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Submit Observation
          </button>
          <p className="submit-hint">
            {!selectedAnswer 
              ? 'Please select an observation before submitting.'
              : 'Click submit to continue to the concept check.'}
          </p>
        </div>
      ) : (
        <div className="check-feedback">
          <div className="feedback-message">
            <div className="feedback-icon">✓</div>
            <h3>Observation Submitted!</h3>
            <p>Your answer has been recorded. Let's see if you understood the concept!</p>
          </div>
          <button className="continue-button" onClick={() => {}} disabled>
            Processing...
          </button>
        </div>
      )}

      <div className="observation-tips">
        <div className="tip-card">
          <h4>💡 Remember:</h4>
          <ul className="tip-list">
            <li>Observe the daylight bar length</li>
            <li>Compare with 12 hours (equal day/night)</li>
            <li>Think about the tilt and position effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ObservationCheck;