import React from 'react';
import GeographyExplanation from './GeographyExplanation';
import './ConsequenceView.css';

const ConsequenceView = ({ result, role, scenario, onNext, onRetry, isLastScenario }) => {
  const isSuccess = result.isCorrect;

  return (
    <div className={`consequence-view ${isSuccess ? 'success' : 'failure'}`}>
      <div className="consequence-header">
        <div className="result-icon">
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2>{isSuccess ? 'Great Decision!' : 'Needs Improvement'}</h2>
      </div>

      <div className="consequence-content">
        <div className="result-card">
          <div className="consequence-text">
            {result.consequence}
          </div>
          
          <div className="points-earned">
            {isSuccess ? (
              <div className="points-positive">
                +{result.points} Resilience Points!
              </div>
            ) : (
              <div className="points-negative">
                No points earned
              </div>
            )}
          </div>

          <div className="feedback">
            <strong>Feedback:</strong> {result.feedback}
          </div>
        </div>

        <GeographyExplanation 
          explanation={result.geographyExplanation}
          disasterType={scenario.disasterType}
          role={role}
        />

        <div className="consequence-actions">
          {isSuccess ? (
            <button onClick={onNext} className="action-button next-button">
              {isLastScenario ? 'Complete Mission' : 'Next Scenario'}
            </button>
          ) : (
            <button onClick={onRetry} className="action-button retry-button">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsequenceView;