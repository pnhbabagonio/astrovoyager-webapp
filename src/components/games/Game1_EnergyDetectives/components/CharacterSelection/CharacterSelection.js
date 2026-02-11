import React, { useState } from 'react';
import './CharacterSelection.css';

const CharacterSelection = ({ characters, onCharacterSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const currentCharacter = characters[currentIndex];

  const handlePrevious = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1
    );
    setTimeout(() => {
      setIsPulsing(false);
    }, 300);
  };

  const handleNext = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => {
      setIsPulsing(false);
    }, 300);
  };

  const handleSelectCharacter = () => {
    onCharacterSelect(currentCharacter);
  };

  return (
    <div className="character-selection-container">
      <div className="selection-header">
        <h2>Choose Your Solar Explorer</h2>
        <p className="subtitle">Select a character to investigate sun energy mysteries</p>
      </div>

      {/* Character Carousel */}
      <div className="character-carousel">
        <div className="carousel-image-row">
          <button 
            className="carousel-arrow prev-arrow"
            onClick={handlePrevious}
            aria-label="Previous character"
          >
            ‹
          </button>

          <div className={`character-image-wrapper ${isPulsing ? 'heartbeat' : ''}`}>
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

          <button 
            className="carousel-arrow next-arrow"
            onClick={handleNext}
            aria-label="Next character"
          >
            ›
          </button>
        </div>

        <div className="character-info">
          <h3 className="character-name">{currentCharacter.name}</h3>
          
          <div className="character-indicators">
            {characters.map((char, index) => (
              <div 
                key={char.id}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <p className="character-description">{currentCharacter.description}</p>
        </div>
      </div>

      {/* Select Button */}
      <button
        className="select-character-button"
        onClick={handleSelectCharacter}
      >
        Select {currentCharacter.name} as Explorer
      </button>
    </div>
  );
};

export default CharacterSelection;