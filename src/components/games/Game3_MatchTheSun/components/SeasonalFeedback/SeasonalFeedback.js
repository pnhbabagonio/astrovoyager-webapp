import React from 'react';
import WeatherChange from './WeatherChange';
import TimeBonus from './TimeBonus';
import './SeasonalFeedback.css';

const SeasonalFeedback = ({ type, result, onContinue }) => {
  const isSuccess = result.isCorrect || result.totalPoints > 0;

  return (
    <div className={`seasonal-feedback ${type}-feedback ${isSuccess ? 'success' : 'failure'}`}>
      <div className="feedback-header">
        <div className="result-icon">
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2>
          {type === 'matching' ? (
            result.isCorrect ? 'Perfect Sun Placement!' : 'Incorrect Position'
          ) : (
            result.totalPoints > 0 ? 'Great Job!' : 'Needs Improvement'
          )}
        </h2>
      </div>

      <div className="feedback-content">
        {type === 'matching' ? (
          <MatchingFeedback result={result} />
        ) : (
          <ActionFeedback result={result} />
        )}

        <WeatherChange 
          season={result.season}
          explanation={result.explanation}
        />

        {result.timeBonus > 0 && (
          <TimeBonus 
            bonus={result.timeBonus}
            totalTime={result.timeRemaining}
          />
        )}
      </div>

      <div className="feedback-actions">
        <button onClick={onContinue} className="continue-button">
          {type === 'matching' 
            ? (result.isCorrect ? 'Continue to Quick Actions' : 'Try Again') 
            : 'Continue to Next Season'
          }
        </button>
      </div>
    </div>
  );
};

const MatchingFeedback = ({ result }) => {
  return (
    <div className="matching-result">
      <div className="points-summary">
        <div className="points-earned">
          {result.isCorrect ? (
            <div className="points-positive">
              +{result.totalPoints} Accuracy Points!
            </div>
          ) : (
            <div className="points-negative">
              No points earned
            </div>
          )}
        </div>

        {result.timeBonus > 0 && (
          <div className="bonus-breakdown">
            <span>Base Points: {result.basePoints}</span>
            <span>Time Bonus: +{result.timeBonus}</span>
          </div>
        )}
      </div>

      <div className="placement-explanation">
        <p>
          The sun follows a <strong>{result.season.sunArc} arc</strong> during {result.season.name.toLowerCase()} 
          because {result.season.explanation.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

const ActionFeedback = ({ result }) => {
  return (
    <div className="action-result">
      <div className="points-summary">
        <div className="points-earned">
          {result.totalPoints > 0 ? (
            <div className="points-positive">
              +{result.totalPoints} Accuracy Points!
            </div>
          ) : (
            <div className="points-negative">
              No points earned
            </div>
          )}
        </div>

        <div className="bonus-breakdown">
          <span>Base Points: {result.basePoints}</span>
          {result.timeBonus > 0 && <span>Time Bonus: +{result.timeBonus}</span>}
        </div>
      </div>

      <div className="actions-review">
        <h3>Your Selections:</h3>
        <div className="actions-list">
          {result.selectedActions.map((action, index) => (
            <div 
              key={action.id}
              className={`action-review ${action.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="action-status">
                {action.isCorrect ? '✓' : '✗'}
              </div>
              <div className="action-text">{action.actionText}</div>
              <div className="action-explanation">
                {action.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalFeedback;