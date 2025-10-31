import React from 'react';
import PlacementFeedback from './PlacementFeedback';
import ScenarioFeedback from './ScenarioFeedback';
import './WeatherFeedback.css';

const WeatherFeedback = ({ type, result, onContinue }) => {
  return (
    <div className="weather-feedback-container">
      <div className={`weather-feedback ${type}-feedback ${result.isCorrect || result.points > 0 ? 'success' : 'failure'}`}>
        {type === 'placement' ? (
          <PlacementFeedback result={result} />
        ) : (
          <ScenarioFeedback result={result} />
        )}
        
        <div className="feedback-actions">
          <button onClick={onContinue} className="continue-button">
            {type === 'placement' 
              ? (result.isCorrect ? 'Continue to Scenario' : 'Try Again') 
              : 'Continue to Map'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherFeedback;