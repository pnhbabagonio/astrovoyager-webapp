import React from 'react';
import './DragDropFillBlanks.css';

const WordBank = ({ words, onDragStart, usedWords }) => {
  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
    onDragStart(word);
  };

  return (
    <div className="astral-database">
      <h3>Spectral Database</h3>
      <div className="database-entries">
        {words.map((word, index) => {
          const isUsed = usedWords.includes(word);
          return (
            <div
              key={index}
              className={`database-entry ${isUsed ? 'used' : ''}`}
              draggable={!isUsed}
              onDragStart={(e) => !isUsed && handleDragStart(e, word)}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordBank;