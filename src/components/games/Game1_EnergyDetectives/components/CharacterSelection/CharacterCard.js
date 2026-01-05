import React from 'react';
import './CharacterSelection.css';

const CharacterCard = ({ character, isSelected, onClick }) => {
  return (
    <div 
      className={`character-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="character-avatar">
        <img 
          src={character.avatar} 
          alt={character.name}
          className="avatar-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${process.env.PUBLIC_URL}/assets/images/characters/default.png`;
          }}
        />
      </div>
      <div className="character-info">
        <h3 className="character-name">{character.name}</h3>
        <p className="character-description">{character.description}</p>
      </div>
      {isSelected && (
        <div className="selection-indicator">✓ Selected</div>
      )}
    </div>
  );
};

export default CharacterCard;