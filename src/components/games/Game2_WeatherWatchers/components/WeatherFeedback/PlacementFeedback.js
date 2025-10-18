import React from 'react';
import FactsDisplay from './FactsDisplay';
import './WeatherFeedback.css';

const PlacementFeedback = ({ result }) => {
  return (
    <div className="placement-feedback">
      <div className="feedback-header">
        <div className="result-icon">
          {result.isCorrect ? '✅' : '❌'}
        </div>
        <h2>
          {result.isCorrect 
            ? 'Correct Placement!' 
            : 'Incorrect Placement'
          }
        </h2>
      </div>

      <div className="feedback-content">
        <div className="placement-result">
          <div className="phenomenon-display">
            <span className="phenomenon-icon">{result.phenomenon.icon}</span>
            <span className="phenomenon-name">{result.phenomenon.name}</span>
          </div>
          
          <div className="placement-arrow">→</div>
          
          <div className="region-display">
            <span className="region-name">{result.region.name}</span>
          </div>
        </div>

        <div className="points-earned">
          {result.isCorrect ? (
            <div className="points-positive">
              +{result.points} Preparedness Points!
            </div>
          ) : (
            <div className="points-negative">
              No points earned
            </div>
          )}
        </div>

        <div className="explanation">
          <p>{result.explanation}</p>
        </div>

        <FactsDisplay 
          facts={result.facts}
          phenomenon={result.phenomenon}
        />
      </div>
    </div>
  );
};

export default PlacementFeedback;