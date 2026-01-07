import React from 'react';
import './DragDropFillBlanks.css'; // We'll use the same CSS

const WordBank = ({ words, onDragStart, usedWords }) => {
  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
    onDragStart(word);
  };

  return (
    <div className="word-bank">
      <h3>Word Bank</h3>
      <div className="words-container">
        {words.map((word, index) => {
          const isUsed = usedWords.includes(word);
          return (
            <div
              key={index}
              className={`word-item ${isUsed ? 'used' : ''}`}
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