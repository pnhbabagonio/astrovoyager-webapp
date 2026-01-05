import React, { useState } from 'react';
import './CharacterSelection.css';

const CharacterSelection = ({ characters, onCharacterSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCharacter = characters[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSelectCharacter = () => {
    onCharacterSelect(currentCharacter);
  };

  return (
    <div className="character-selection-container">
      <div className="selection-header">
        <h2>Choose Your Energy Detective</h2>
        <p className="subtitle">Select a character to explore the Sun's energy mysteries</p>
      </div>

      <div className="character-content">
        {/* Left: Full Size Character Image */}
        <div className="character-image-section">
          <div className="character-image-wrapper">
            <img 
              src={currentCharacter.avatar} 
              alt={currentCharacter.name}
              className="character-full-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/assets/images/characters/default.png`;
              }}
            />
          </div>
        </div>

        {/* Right: Character Information */}
        <div className="character-info-section">
          <div className="character-info-content">
            <h3 className="character-name-display">{currentCharacter.name}</h3>
            <p className="character-description-display">{currentCharacter.description}</p>
            
            <div className="character-attributes">
              <div className="attribute">
                <span className="attribute-icon">🔍</span>
                <span className="attribute-text">Investigator</span>
              </div>
              <div className="attribute">
                <span className="attribute-icon">☀️</span>
                <span className="attribute-text">Energy Expert</span>
              </div>
              <div className="attribute">
                <span className="attribute-icon">🚀</span>
                <span className="attribute-text">Space Explorer</span>
              </div>
            </div>

            <button
              className="select-character-button"
              onClick={handleSelectCharacter}
            >
              Select {currentCharacter.name}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Navigation Buttons */}
      <div className="navigation-section">
        <div className="navigation-controls">
          <button 
            className="nav-button prev-button"
            onClick={handlePrevious}
          >
            ← Previous
          </button>
          
          <div className="character-indicators">
            {characters.map((char, index) => (
              <div 
                key={char.id}
                className={`character-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          <button 
            className="nav-button next-button"
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;