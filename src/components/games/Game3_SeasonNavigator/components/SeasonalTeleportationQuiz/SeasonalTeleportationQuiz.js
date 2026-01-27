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
    
    setShowFeedback(true);
    
    const answerEntry = {
      scenarioId: currentScenario.id,
      selectedOptionId: optionId,
      isCorrect: correct,
      points: correct ? currentScenario.points : 0
    };
    
    setAnswers(prev => [...prev, answerEntry]);
    
    setTimeout(() => {
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
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
      <div className="navigation-header">
        <div className="warp-drive-effect">
          <span className="warp-icon">🚀</span>
          <h2>Celestial Navigation</h2>
          <span className="warp-icon">🌌</span>
        </div>
        <p className="navigation-subtitle">Plot your course through the celestial sphere!</p>
        
        <div className="navigation-progress">
          <span>Waypoint {currentScenarioIndex + 1} of {scenarios.length}</span>
          <div className="progress-constellation">
            {scenarios.map((_, index) => (
              <div 
                key={index}
                className={`constellation-star ${index === currentScenarioIndex ? 'active' : ''} ${index < currentScenarioIndex ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="navigation-console">
        <ScenarioCard 
          scenario={currentScenario}
          showFeedback={showFeedback}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />

        <div className="destination-grid">
          {currentScenario.options.map(option => (
            <button
              key={option.id}
              className={`destination-card 
                ${selectedOption === option.id ? 'selected' : ''}
                ${showFeedback ? (option.correct ? 'correct' : selectedOption === option.id ? 'incorrect' : '') : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
            >
              <div className="destination-icon">{getRegionIcon(option.text)}</div>
              <div className="destination-content">
                <span className="destination-text">{option.text}</span>
                {showFeedback && option.correct && (
                  <span className="course-plot">✓ Optimal Course</span>
                )}
              </div>
              {selectedOption === option.id && !showFeedback && (
                <div className="selection-beam">→</div>
              )}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`warp-feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <h4>{isCorrect ? '🎯 Course Optimal!' : '💡 Course Adjustment Needed'}</h4>
            <p>{currentScenario.explanation}</p>
            <div className="energy-expended">
              {isCorrect ? `+${currentScenario.points} energy units` : 'Energy conservation mode'}
            </div>
          </div>
        )}

        <div className="navigation-telemetry">
          <div className="telemetry-readout">
            <span className="telemetry-label">Course Energy</span>
            <span className="telemetry-value">
              {answers.reduce((sum, a) => sum + a.points, 0)} units
            </span>
          </div>
          <div className="telemetry-readout">
            <span className="telemetry-label">Navigation Accuracy</span>
            <span className="telemetry-value">
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