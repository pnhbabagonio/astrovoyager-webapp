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
            className="blank"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(currentSentence.blanks[index])}
          >
            {sentenceBlanks[index]?.word || '_____'}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="drag-drop-fill-blanks">
      <div className="exercise-header">
        <h2>📝 Fill in the Blanks</h2>
        <p className="subtitle">Drag and drop words to complete the sentences about seasons.</p>
        <div className="progress">Sentence {currentSentenceIndex + 1} of {sentences.length}</div>
      </div>

      <div className="exercise-content">
        <div className="sentence-display">
          <div className="sentence">{renderSentence()}</div>
        </div>

        <WordBank 
          words={[...wordBank.correctWords, ...wordBank.distractorWords]}
          onDragStart={handleDragStart}
          usedWords={sentenceBlanks.map(blank => blank.word).filter(Boolean)}
        />

        <div className="controls">
          <button 
            onClick={handleSubmitSentence}
            disabled={sentenceBlanks.some(blank => !blank.word)}
            className="submit-button"
          >
            {currentSentenceIndex < sentences.length - 1 ? 'Next Sentence' : 'Complete Exercise'}
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-message">
          <p>All sentences completed! Moving to next stage...</p>
        </div>
      )}
    </div>
  );
};

export default DragDropFillBlanks;