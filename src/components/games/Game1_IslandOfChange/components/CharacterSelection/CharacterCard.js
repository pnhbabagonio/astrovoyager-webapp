import React from 'react';
import './CharacterSelection.css';

const CharacterCard = ({ character, isSelected, onClick }) => {
  return (
    <div 
      className={`character-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="character-avatar">{character.avatar}</div>
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