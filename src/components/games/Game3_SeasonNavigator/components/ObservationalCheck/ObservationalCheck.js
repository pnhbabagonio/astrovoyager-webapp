// ObservationalCheck.js - Updated with space theme
import React, { useState } from 'react';
import './ObservationalCheck.css';

const ObservationalCheck = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSample, setShowSample] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    // Simple scoring: check if answer contains any keyword (for demo)
    const containsKeyword = currentQuestion.keywords.some(keyword =>
      userAnswer.toLowerCase().includes(keyword.toLowerCase())
    );
    const points = containsKeyword ? currentQuestion.points : currentQuestion.points / 2;

    const answer = {
      questionId: currentQuestion.id,
      userAnswer,
      points,
      maxPoints: currentQuestion.points
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setShowSample(true);
    
    // Create observation effect
    createObservationEffect(points);
  };

  const createObservationEffect = (points) => {
    const colors = points >= currentQuestion.points / 2 
      ? ['#4caf50', '#00f7ff']
      : ['#ff5252', '#ff8e53'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 4 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = '60vh';
        particle.style.backgroundColor = colors[i % 2];
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 3}px currentColor`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1500);
      }, i * 30);
    }
  };

  const handleContinue = () => {
    setShowSample(false);
    setUserAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="observational-check">
      <div className="check-header">
        <h2>🔭 Stellar Observation Report</h2>
        <p className="subtitle">Record your observations of seasonal phenomena across the galaxy.</p>
        <div className="progress">
          Observation {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="check-content">
        <div className="question">
          <h3>{currentQuestion.question}</h3>
        </div>

        <div className="answer-section">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Record your stellar observations here..."
            rows={8}
            disabled={showSample}
          />
        </div>

        <div className="controls">
          {!showSample ? (
            <button 
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="submit-button"
            >
              Submit Observation
            </button>
          ) : (
            <button 
              onClick={handleContinue}
              className="continue-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Observation' : 'Complete Analysis'}
            </button>
          )}
        </div>

        {showSample && (
          <div className="sample-answers">
            <h4>📊 Analysis Data:</h4>
            <ul>
              {currentQuestion.sampleAnswers.map((sample, index) => (
                <li key={index}>{sample}</li>
              ))}
            </ul>
            <p className="points-info">
              Observation Quality: {answers[currentQuestionIndex]?.points || 0}/{currentQuestion.points} points
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationalCheck;