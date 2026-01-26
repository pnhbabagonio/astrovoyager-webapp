// DragDropFillBlanks.js - Updated with space theme
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
    // Create drag effect
    createDragEffect(word);
  };

  const createDragEffect = (word) => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.left = '50%';
        particle.style.top = '70vh';
        particle.style.backgroundColor = '#9d4edd';
        particle.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px #9d4edd`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 800);
      }, i * 50);
    }
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
    
    // Create drop effect
    createDropEffect();
  };

  const createDropEffect = () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 2 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.backgroundColor = '#00f7ff';
        particle.style.boxShadow = `0 0 ${Math.random() * 6 + 2}px #00f7ff`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 600);
      }, i * 30);
    }
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

    // Create completion effect
    createCompletionEffect(isCorrect, points);

    // Move to next sentence or complete
    if (currentSentenceIndex < sentences.length - 1) {
      setTimeout(() => {
        setCurrentSentenceIndex(prev => prev + 1);
      }, 1000);
    } else {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete(newUserAnswers);
      }, 1500);
    }
  };

  const createCompletionEffect = (isCorrect, points) => {
    const colors = isCorrect 
      ? ['#4caf50', '#00f7ff', '#ffd700']
      : ['#ff5252', '#ff8e53', '#9d4edd'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 4 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.backgroundColor = colors[i % colors.length];
        particle.style.boxShadow = `0 0 ${Math.random() * 12 + 3}px currentColor`;
        document.querySelector('.season-navigator-root').appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1200);
      }, i * 40);
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
            className={`blank ${sentenceBlanks[index]?.word ? 'filled' : ''}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(currentSentence.blanks[index])}
          >
            {sentenceBlanks[index]?.word || '______'}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="drag-drop-fill-blanks">
      <div className="exercise-header">
        <h2>📝 Astronaut Log Entries</h2>
        <p className="subtitle">Complete the mission log entries about seasonal phenomena across the galaxy.</p>
        <div className="progress">Log Entry {currentSentenceIndex + 1} of {sentences.length}</div>
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
            {currentSentenceIndex < sentences.length - 1 ? 'Next Log Entry' : 'Complete Mission Log'}
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-message">
          <p>Mission log complete! Transmitting data to command center...</p>
        </div>
      )}
    </div>
  );
};

export default DragDropFillBlanks;