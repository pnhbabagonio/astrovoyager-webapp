import React, { useState, useEffect } from 'react';
import './DragDropFillBlanks.css';
import WordBank from './WordBank';

const DragDropFillBlanks = ({ sentences, wordBank, selectedRegion, onComplete }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [draggedWord, setDraggedWord] = useState(null);
  const [sentenceBlanks, setSentenceBlanks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize the blanks for the current sentence
  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex];
    const blanks = currentSentence.blanks.map(blankId => ({
      id: blankId,
      word: null,
      isCorrect: null
    }));
    setSentenceBlanks(blanks);
  }, [currentSentenceIndex, sentences]);

  const handleDragStart = (word) => {
    setDraggedWord(word);
  };

  const handleDrop = (blankId) => {
    if (!draggedWord) return;

    const updatedBlanks = sentenceBlanks.map(blank => {
      if (blank.id === blankId) {
        return { ...blank, word: draggedWord };
      }
      return blank;
    });

    setSentenceBlanks(updatedBlanks);
    setDraggedWord(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmitSentence = () => {
    const currentSentence = sentences[currentSentenceIndex];
    const isCorrect = sentenceBlanks.every((blank, index) => 
      blank.word === currentSentence.correctAnswers[index]
    );

    const points = isCorrect ? currentSentence.points : 0;

    const answer = {
      sentenceId: currentSentence.id,
      userAnswers: sentenceBlanks.map(blank => blank.word),
      correctAnswers: currentSentence.correctAnswers,
      isCorrect,
      points,
      explanation: currentSentence.explanation
    };

    const newUserAnswers = [...userAnswers, answer];
    setUserAnswers(newUserAnswers);

    // Move to next sentence or complete
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete(newUserAnswers);
    }
  };

  const currentSentence = sentences[currentSentenceIndex];

  // Split the sentence text to insert blanks
  const renderSentence = () => {
    const parts = currentSentence.text.split('_____');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        <span>{part}</span>
        {index < parts.length - 1 && (
          <div 
            className="data-port"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(currentSentence.blanks[index])}
          >
            {sentenceBlanks[index]?.word || '[Drop Data]'}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="drag-drop-fill-blanks">
      <div className="observatory-analysis-header">
        <h2>📡 Astral Data Analysis</h2>
        <p className="analysis-subtitle">Complete the celestial data streams by dragging spectral data points</p>
        <div className="analysis-progress">Data Stream {currentSentenceIndex + 1} of {sentences.length}</div>
      </div>

      <div className="data-terminal">
        <div className="sentence-display">
          <div className="sentence">{renderSentence()}</div>
        </div>

        <WordBank 
          words={[...wordBank.correctWords, ...wordBank.distractorWords]}
          onDragStart={handleDragStart}
          usedWords={sentenceBlanks.map(blank => blank.word).filter(Boolean)}
        />

        <div className="analysis-controls">
          <button 
            onClick={handleSubmitSentence}
            disabled={sentenceBlanks.some(blank => !blank.word)}
            className="analyze-button"
          >
            {currentSentenceIndex < sentences.length - 1 ? 'Analyze Next Stream' : 'Complete Analysis'}
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="data-transmission-complete">
          <p>✓ All data streams analyzed! Proceeding to navigation phase...</p>
        </div>
      )}
    </div>
  );
};

export default DragDropFillBlanks;