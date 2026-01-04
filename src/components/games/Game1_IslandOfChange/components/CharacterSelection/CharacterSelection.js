import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import './CharacterSelection.css';

const CharacterSelection = ({ characters, onCharacterSelect }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);

  const handleCharacterClick = (character) => {
    setSelectedCharacterId(character.id);
  };

  const handleConfirmSelection = () => {
    const selectedCharacter = characters.find(char => char.id === selectedCharacterId);
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter);
    }
  };

  return (
    <div className="character-selection">
      <div className="selection-header">
        <h2>Choose Your Energy Detective</h2>
        <p className="subtitle">Select a character to explore the Sun's energy mysteries</p>
      </div>

      <div className="characters-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacterId === character.id}
            onClick={() => handleCharacterClick(character)}
          />
        ))}
      </div>

      <div className="selection-footer">
        <button
          className="confirm-button"
          onClick={handleConfirmSelection}
          disabled={!selectedCharacterId}
        >
          {selectedCharacterId ? 'Launch Mission!' : 'Select a Character'}
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;