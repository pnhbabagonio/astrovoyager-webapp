import React, { useState, useEffect } from 'react';
import ScenarioCard from './ScenarioCard';
import './SeasonalTeleportationQuiz.css';

const SeasonalTeleportationQuiz = ({ scenarios, selectedRegion, onComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];

  const handleOptionSelect = (optionId) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    const correct = currentScenario.options.find(opt => opt.id === optionId)?.correct || false;
    setIsCorrect(correct);
    
    // Show feedback
    setShowFeedback(true);
    
    // Add to answers
    const answerEntry = {
      scenarioId: currentScenario.id,
      selectedOptionId: optionId,
      isCorrect: correct,
      points: correct ? currentScenario.points : 0
    };
    
    setAnswers(prev => [...prev, answerEntry]);
    
    // Auto-advance after delay
    setTimeout(() => {
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // All scenarios completed
        onComplete(answers.concat(answerEntry));
      }
    }, 2000);
  };

  const getRegionIcon = (optionText) => {
    if (optionText.includes('Northern')) return '🌎↑';
    if (optionText.includes('Southern')) return '🌎↓';
    if (optionText.includes('Equator')) return '🌎→';
    return '❓';
  };

  return (
    <div className="seasonal-teleportation-quiz">
      <div className="quiz-header">
        <div className="teleportation-effect">
          <span className="teleport-icon">🚀</span>
          <h2>Seasonal Teleportation Challenge</h2>
          <span className="teleport-icon">🌌</span>
        </div>
        <p className="quiz-subtitle">Choose your destination wisely!</p>
        
        <div className="progress-indicator">
          <span>Scenario {currentScenarioIndex + 1} of {scenarios.length}</span>
          <div className="progress-dots">
            {scenarios.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${index === currentScenarioIndex ? 'active' : ''} ${index < currentScenarioIndex ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-content">
        <ScenarioCard 
          scenario={currentScenario}
          showFeedback={showFeedback}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />

        <div className="options-grid">
          {currentScenario.options.map(option => (
            <button
              key={option.id}
              className={`option-card 
                ${selectedOption === option.id ? 'selected' : ''}
                ${showFeedback ? (option.correct ? 'correct' : selectedOption === option.id ? 'incorrect' : '') : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
            >
              <div className="option-icon">{getRegionIcon(option.text)}</div>
              <div className="option-content">
                <span className="option-text">{option.text}</span>
                {showFeedback && option.correct && (
                  <span className="correct-badge">✓ Correct Answer</span>
                )}
              </div>
              {selectedOption === option.id && !showFeedback && (
                <div className="selection-indicator">→</div>
              )}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <h4>{isCorrect ? '🎯 Correct!' : '💡 Almost!'}</h4>
            <p>{currentScenario.explanation}</p>
            <div className="points-earned">
              {isCorrect ? `+${currentScenario.points} points` : 'No points earned'}
            </div>
          </div>
        )}

        <div className="quiz-stats">
          <div className="stats-card">
            <span className="stats-label">Current Score</span>
            <span className="stats-value">
              {answers.reduce((sum, a) => sum + a.points, 0)} points
            </span>
          </div>
          <div className="stats-card">
            <span className="stats-label">Accuracy</span>
            <span className="stats-value">
              {answers.length > 0 
                ? `${Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalTeleportationQuiz;