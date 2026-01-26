// SeasonalTeleportationQuiz.js - Updated with space theme
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
    
    // Create wormhole effect
    createWormholeEffect(correct);
    
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

  const createWormholeEffect = (correct) => {
    const colors = correct 
      ? ['#4caf50', '#00f7ff', '#4caf50']
      : ['#ff5252', '#ff8e53', '#ff5252'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.backgroundColor = colors[i % 3];
        particle.style.boxShadow = `0 0 ${Math.random() * 15 + 5}px currentColor`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1000);
      }, i * 50);
    }
  };

  const getRegionIcon = (optionText) => {
    if (optionText.includes('Northern')) return '🌎↑';
    if (optionText.includes('Southern')) return '🌎↓';
    if (optionText.includes('Equator')) return '🌎→';
    if (optionText.includes('Spring')) return '🌱';
    if (optionText.includes('Summer')) return '☀️';
    if (optionText.includes('Autumn')) return '🍂';
    if (optionText.includes('Winter')) return '❄️';
    return '🪐';
  };

  return (
    <div className="seasonal-teleportation-quiz">
      <div className="quiz-header">
        <div className="teleportation-effect">
          <span className="teleport-icon">🚀</span>
          <h2>Wormhole Navigation Challenge</h2>
          <span className="teleport-icon">🌌</span>
        </div>
        <p className="quiz-subtitle">Navigate through space-time wormholes to reach the correct seasonal destination!</p>
        
        <div className="progress-indicator">
          <span>Wormhole {currentScenarioIndex + 1} of {scenarios.length}</span>
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
        {/* Scenario Card */}
        <div className="scenario-card">
          <div className="scenario-question">
            <h3>{currentScenario.question}</h3>
          </div>
        </div>

        {/* Navigation Options */}
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
                  <span className="correct-badge">✓ Wormhole Stable</span>
                )}
              </div>
              {selectedOption === option.id && !showFeedback && (
                <div className="selection-indicator">→</div>
              )}
            </button>
          ))}
        </div>

        {/* Wormhole Analysis */}
        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <h4>{isCorrect ? '🎯 Wormhole Stable!' : '⚠️ Wormhole Unstable!'}</h4>
            <p>{currentScenario.explanation}</p>
            <div className="points-earned">
              {isCorrect ? `+${currentScenario.points} energy credits` : 'Energy loss detected'}
            </div>
          </div>
        )}

        {/* Navigation Statistics */}
        <div className="quiz-stats">
          <div className="stats-card">
            <span className="stats-label">Energy Credits</span>
            <span className="stats-value">
              {answers.reduce((sum, a) => sum + a.points, 0)} EC
            </span>
          </div>
          <div className="stats-card">
            <span className="stats-label">Navigation Accuracy</span>
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