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
      <div className="telescope-observation-header">
        <h2>🔭 Telescope Observations</h2>
        <p className="observation-subtitle">Record your findings from the celestial observation</p>
        <div className="observation-progress">
          Observation {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="observation-chamber">
        <div className="astronomical-phenomenon">
          <h3>{currentQuestion.question}</h3>
        </div>

        <div className="observation-log">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Record your celestial observations here..."
            rows={6}
            disabled={showSample}
          />
        </div>

        <div className="analysis-controls">
          {!showSample ? (
            <button 
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="record-observation-button"
            >
              Record Observation
            </button>
          ) : (
            <button 
              onClick={handleContinue}
              className="confirm-analysis-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Observation' : 'Complete Analysis'}
            </button>
          )}
        </div>

        {showSample && (
          <div className="spectrograph-analysis">
            <h4>🔬 Spectrograph Analysis:</h4>
            <ul>
              {currentQuestion.sampleAnswers.map((sample, index) => (
                <li key={index}>{sample}</li>
              ))}
            </ul>
            <p className="research-points">
              Research Points: {answers[currentQuestionIndex]?.points || 0} out of {currentQuestion.points}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationalCheck;