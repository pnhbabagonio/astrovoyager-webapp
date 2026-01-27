import React from 'react';
import './ReviewIncorrectAnswers.css';

const ReviewIncorrectAnswers = ({ incorrectAnswers, scenarios, onReturn }) => {
  const getScenario = (scenarioId) => {
    return scenarios.find(s => s.id === scenarioId);
  };

  return (
    <div className="review-incorrect">
      <div className="anomaly-analysis-header">
        <h2>⚠️ Anomaly Analysis</h2>
        <p className="anomaly-subtitle">Review and recalibrate navigation systems</p>
      </div>

      <div className="anomaly-console">
        {incorrectAnswers.length === 0 ? (
          <p className="system-clear">All systems operating normally</p>
        ) : (
          incorrectAnswers.map((answer, index) => {
            const scenario = getScenario(answer.scenarioId);
            const selectedOption = scenario.options.find(opt => opt.id === answer.selectedOptionId);
            const correctOption = scenario.options.find(opt => opt.correct);

            return (
              <div key={index} className="anomaly-investigation">
                <h3>Anomaly {index + 1}</h3>
                <p className="celestial-event">{scenario.question}</p>
                
                <div className="signal-analysis">
                  <div className="signal anomaly-signal">
                    <span className="signal-label">YOUR COURSE:</span>
                    <span className="signal-data">{selectedOption.text}</span>
                  </div>
                  <div className="signal correct-signal">
                    <span className="signal-label">OPTIMAL COURSE:</span>
                    <span className="signal-data">{correctOption.text}</span>
                  </div>
                </div>

                <div className="transmission-decode">
                  <h4>📡 Transmission Decode:</h4>
                  <p>{scenario.explanation}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="analysis-protocol">
        <button onClick={onReturn} className="recalibrate-button">
          Return to Analysis Report
        </button>
      </div>
    </div>
  );
};

export default ReviewIncorrectAnswers;