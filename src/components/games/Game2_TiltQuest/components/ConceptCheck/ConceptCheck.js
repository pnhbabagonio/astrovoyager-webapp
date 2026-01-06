import React, { useState } from 'react';
import './ConceptCheck.css';

const ConceptCheck = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId, answerId) => {
    if (!isSubmitted) {
      setAnswers({
        ...answers,
        [questionId]: answerId
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Calculate score (simplified - in real app would check against correct answers)
    const conceptAnswers = {
      concept1: answers[questions[0].id] || null,
      concept2: answers[questions[1].id] || null
    };
    setTimeout(() => {
      onComplete(conceptAnswers);
    }, 1500);
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] !== undefined;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  return (
    <div className="concept-check">
      <div className="concept-header">
        <h2>🧠 Concept Check</h2>
        <p className="concept-instruction">
          Test your understanding of Earth's tilt and daylight changes
        </p>
      </div>

      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <span className="question-number">Q{currentQuestionIndex + 1}</span>
          <h3 className="question-text">{currentQuestion.question}</h3>
        </div>

        <div className="options-container">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`concept-option ${answers[currentQuestion.id] === option.id ? 'selected' : ''} ${isSubmitted ? 'submitted' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
            >
              <div className="option-indicator">
                <div className="indicator-circle">
                  {answers[currentQuestion.id] === option.id ? '✓' : ''}
                </div>
              </div>
              <div className="option-content">
                <span className="option-text">{option.text}</span>
              </div>
            </div>
          ))}
        </div>

        {isSubmitted && (
          <div className="explanation-box">
            <h4>💡 Explanation:</h4>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="navigation-controls">
        <button
          className="nav-button prev-button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitted}
        >
          ← Previous
        </button>
        
        <div className="question-status">
          {isQuestionAnswered(currentQuestion.id) ? (
            <span className="status-answered">✓ Answered</span>
          ) : (
            <span className="status-unanswered">Select an answer</span>
          )}
        </div>
        
        <button
          className="nav-button next-button"
          onClick={handleNextQuestion}
          disabled={!isQuestionAnswered(currentQuestion.id) || isSubmitted}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next →' : 'Submit Answers'}
        </button>
      </div>

      {isSubmitted && (
        <div className="submission-feedback">
          <div className="feedback-content">
            <div className="spinner"></div>
            <h3>Processing your answers...</h3>
            <p>Calculating your understanding of Earth's tilt concepts</p>
          </div>
        </div>
      )}

      <div className="concept-tips">
        <div className="tip-box">
          <h4>💭 Think About:</h4>
          <ul className="tip-list">
            <li>What did you observe in the simulation?</li>
            <li>How does tilt affect different locations?</li>
            <li>Remember: Distance from Sun ≠ Seasons!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConceptCheck;