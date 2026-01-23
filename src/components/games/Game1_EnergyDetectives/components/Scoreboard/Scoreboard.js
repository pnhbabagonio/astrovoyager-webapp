import './Scoreboard.css';

const Scoreboard = ({ score, totalQuestions, character, onContinue }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>Mission Complete! 🚀</h2>
        <p className="subtitle">Your Energy Investigation Results</p>
      </div>
      
      <div className="score-display">
        <div className="score-circle">
          <div className="score-number">{score}<span className="score-total">/{totalQuestions}</span></div>
          <div className="score-label">Correct Answers</div>
          {/* <div className="score-percentage">{percentage}%</div> */}
        </div>
        
        <div className="score-breakdown">
          <div className="score-item correct">
            <span className="score-item-icon">✅</span>
            <span className="score-item-text">Correct: {score}</span>
          </div>
          <div className="score-item incorrect">
            <span className="score-item-icon">❌</span>
            <span className="score-item-text">Incorrect: {totalQuestions - score}</span>
          </div>
        </div>
      </div>
      
      <div className="character-performance">
        <div className="character-summary">
          <div className="character-avatar-large">
            <img 
              src={character.avatar} 
              alt={character.name}
              className="avatar-image-large"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/assets/images/characters/default.png`;
              }}
            />
          </div>
          <div className="character-performance-info">
            <h3>{character.name}, Energy Detective</h3>
            <p>Great job investigating the Sun's energy mysteries!</p>
          </div>
        </div>
        
        <div className="performance-message">
          {percentage >= 90 && "🏆 Outstanding! You're a true Energy Expert!"}
          {percentage >= 70 && percentage < 90 && "🌟 Excellent work! You understand Sun energy well!"}
          {percentage >= 50 && percentage < 70 && "👍 Good job! You're on your way to becoming an Energy Detective!"}
          {percentage < 50 && "🌱 Keep learning! Every great scientist starts somewhere!"}
        </div>
      </div>
      
      <div className="scoreboard-footer">
        <button onClick={onContinue} className="continue-button">
          Continue to Reflection & Discussion
        </button>
        <p className="instructions">
          Next, you'll reflect on what you learned about the Sun's energy
        </p>
      </div>
    </div>
  );
};

export default Scoreboard;