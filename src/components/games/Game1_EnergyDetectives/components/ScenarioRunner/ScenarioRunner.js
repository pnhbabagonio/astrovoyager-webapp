// ScenarioRunner.js
import React, { useState } from 'react';
import ScenarioHeader from './ScenarioHeader';
import ChoiceGrid from './ChoiceGrid';
import './ScenarioRunner.css';

const ScenarioRunner = ({ scenario, character, onChoiceSelect, scenarioNumber, totalScenarios }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoading(false);
    e.target.onerror = null;
    e.target.src = `${process.env.PUBLIC_URL}/assets/images/game1/scenarios/default-scene.png`;
    e.target.alt = "Scenario image not available";
  };

  return (
    <div className="scenario-runner">
      <ScenarioHeader
        scenarioNumber={scenarioNumber}
        totalScenarios={totalScenarios}
        character={character}
      />
      
      <div className="scenario-content">
        <div className="scenario-image-container">
          {imageLoading && (
            <div className="loading-placeholder">
              <div className="placeholder-sun">☀️</div>
            </div>
          )}
          
          {!imageError ? (
            <img 
              src={scenario.image} 
              alt={`Scenario ${scenarioNumber}: ${scenario.title}`}
              className="scenario-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          ) : (
            <div className="scenario-image-container fallback">
              <div className="sun-icon">☀️</div>
              <div className="image-label">Scenario {scenarioNumber}</div>
            </div>
          )}
          
          {!imageError && !imageLoading && (
            <div className="image-label">Scenario {scenarioNumber}</div>
          )}
        </div>
        
        <div className="scenario-text">
          <h2>{scenario.title}</h2>
          <div className="character-quote">
            <img 
              src={character.avatar} 
              alt={character.name}
              className="character-avatar-small"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/assets/images/characters/default.png`;
              }}
            />
            <span className="character-name-small">{character.name}:</span>
            <span className="quote-text">What do you think happens next?</span>
          </div>
        </div>
        
        <ChoiceGrid
          choices={scenario.choices}
          onChoiceSelect={onChoiceSelect}
        />
      </div>
    </div>
  );
};

export default ScenarioRunner;