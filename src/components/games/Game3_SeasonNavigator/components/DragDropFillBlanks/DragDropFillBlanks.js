import React, { useState, useEffect } from 'react';
import './DragDropFillBlanks.css';
import WordBank from './WordBank';

const DragDropFillBlanks = ({ sentences, wordBank, selectedRegion, onComplete }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [draggedWord, setDraggedWord] = useState(null);
  const [sentenceBlanks, setSentenceBlanks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  // Initialize the blanks for the current sentence
  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex];
    const blanks = currentSentence.blanks.map(blankId => ({
      id: blankId,
      word: null,
      isCorrect: null
    }));
    setSentenceBlanks(blanks);
    setShowFeedback(false);
    setCurrentFeedback(null);
  }, [currentSentenceIndex, sentences]);

  const handleDragStart = (word) => {
    if (!showFeedback) {
      setDraggedWord(word);
    }
  };

  const handleDrop = (blankId) => {
    if (!draggedWord || showFeedback) return;

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

  const checkAnswer = () => {
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

    // Set feedback for current sentence
    setCurrentFeedback({
      isCorrect,
      correctAnswers: currentSentence.correctAnswers,
      userAnswers: sentenceBlanks.map(blank => blank.word),
      explanation: currentSentence.explanation
    });
    
    setShowFeedback(true);
    setUserAnswers(prev => [...prev, answer]);

    // Update blanks to show correct/incorrect state
    const updatedBlanks = sentenceBlanks.map((blank, index) => ({
      ...blank,
      isCorrect: blank.word === currentSentence.correctAnswers[index]
    }));
    setSentenceBlanks(updatedBlanks);
  };

  const handleNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete(userAnswers);
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
            className={`data-port ${showFeedback ? 
              (sentenceBlanks[index]?.isCorrect ? 'correct' : 'incorrect') : ''}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(currentSentence.blanks[index])}
          >
            {sentenceBlanks[index]?.word || '[Drop Data]'}
            {showFeedback && !sentenceBlanks[index]?.isCorrect && (
              <div className="correct-answer-hint">
                Correct: {currentSentence.correctAnswers[index]}
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    ));
  };

  // Get all available words (filter out used ones)
  const getAvailableWords = () => {
    const usedWords = sentenceBlanks.map(blank => blank.word).filter(Boolean);
    const allWords = [...wordBank.correctWords, ...wordBank.distractorWords];
    return allWords.filter(word => !usedWords.includes(word) || showFeedback);
  };

  return (
    <div className="drag-drop-fill-blanks">
      <div className="observatory-analysis-header">
        <h2>📡 Astral Data Analysis</h2>
        <p className="analysis-subtitle">Complete the celestial data streams by dragging spectral data points</p>
        <div className="analysis-progress">
          Data Stream {currentSentenceIndex + 1} of {sentences.length}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="data-terminal">
        <div className="sentence-display">
          <div className="sentence-container">
            <div className="sentence">{renderSentence()}</div>
          </div>
        </div>

        {!showFeedback && (
          <WordBank 
            words={getAvailableWords()}
            onDragStart={handleDragStart}
            usedWords={sentenceBlanks.map(blank => blank.word).filter(Boolean)}
          />
        )}

        {showFeedback && currentFeedback && (
          <div className={`feedback-container ${currentFeedback.isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <div className="feedback-header">
              <span className="feedback-icon">
                {currentFeedback.isCorrect ? '✅' : '❌'}
              </span>
              <h3>{currentFeedback.isCorrect ? 'Data Stream Analyzed!' : 'Data Stream Analysis Error'}</h3>
            </div>
            <div className="feedback-details">
              <div className="answer-comparison">
                <div className="comparison-row">
                  <span className="comparison-label">Your answer:</span>
                  <span className={`user-answer ${currentFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
                    {currentFeedback.userAnswers.join(', ')}
                  </span>
                </div>
                {!currentFeedback.isCorrect && (
                  <div className="comparison-row">
                    <span className="comparison-label">Correct answer:</span>
                    <span className="correct-answer">
                      {currentFeedback.correctAnswers.join(', ')}
                    </span>
                  </div>
                )}
              </div>
              <div className="feedback-explanation">
                <p>{currentFeedback.explanation}</p>
              </div>
              <div className="feedback-points">
                {currentFeedback.isCorrect ? `+${sentences[currentSentenceIndex].points} energy units` : 'No energy units gained'}
              </div>
            </div>
          </div>
        )}

        <div className="analysis-controls">
          {!showFeedback ? (
            <button 
              onClick={checkAnswer}
              disabled={sentenceBlanks.some(blank => !blank.word)}
              className="analyze-button"
            >
              Analyze Stream
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="next-button"
            >
              {currentSentenceIndex < sentences.length - 1 ? 'Next Stream' : 'Complete Analysis'}
            </button>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="data-transmission-complete">
          <div className="completion-badge">
            <span className="badge-icon">📡</span>
            <span className="badge-text">All Data Streams Analyzed</span>
          </div>
          <p>Proceeding to navigation phase...</p>
        </div>
      )}
    </div>
  );
};

export default DragDropFillBlanks;