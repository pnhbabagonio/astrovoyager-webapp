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
        <h2>🤔 Observational Check</h2>
        <p className="subtitle">Reflect on what you've learned about seasons.</p>
        <div className="progress">
          Question {currentQuestionIndex + 1} of {questions.length}
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
            placeholder="Type your reflection here..."
            rows={6}
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
              Submit Reflection
            </button>
          ) : (
            <button 
              onClick={handleContinue}
              className="continue-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Reflection'}
            </button>
          )}
        </div>

        {showSample && (
          <div className="sample-answers">
            <h4>Sample Answers:</h4>
            <ul>
              {currentQuestion.sampleAnswers.map((sample, index) => (
                <li key={index}>{sample}</li>
              ))}
            </ul>
            <p className="points-info">
              You earned {answers[currentQuestionIndex]?.points || 0} out of {currentQuestion.points} points.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationalCheck;