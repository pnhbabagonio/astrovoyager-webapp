import React from 'react';
import './QuickActionChallenge.css';

const ActionButton = ({ action, isSelected, onSelect, disabled, index }) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect(action);
    }
  };

  return (
    <button
      className={`action-button ${isSelected ? 'selected' : ''} ${action.isCorrect ? 'correct-option' : 'incorrect-option'} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="action-checkbox">
        {isSelected ? '✓' : ''}
      </div>
      <div className="action-text">{action.actionText}</div>
      {!disabled && (
        <div className="action-timer">⏱️ {action.timeLimit}s</div>
      )}
    </button>
  );
};

export default ActionButton;