import './FeedbackView.css';

const FeedbackView = ({ feedback, scenario, onNext, isLastScenario }) => {
  return (
    <div className="feedback-view">
      <div className="feedback-header">
        <h2>Energy Analysis</h2>
        <div className={`result-badge ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          {feedback.isCorrect ? '✅ Correct!' : '❌ Try Again'}
        </div>
      </div>
      
      <div className="feedback-content">
        <div className="scenario-review">
          <div className="scenario-review-card">
            <h3>Scenario:</h3>
            <p>{scenario.title}</p>
          </div>
          
          <div className="explanation-card">
            <h3>Your Answer:</h3>
            <p className="selected-answer">{feedback.choice.text}</p>
            
            <h3>Explanation:</h3>
            <div className={`explanation-text ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
              {feedback.explanation}
            </div>
            
            <div className="energy-tip">
              <div className="tip-icon">💡</div>
              <div className="tip-content">
                <strong>Energy Tip:</strong> Remember this for future energy investigations!
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="feedback-footer">
        <button onClick={onNext} className="next-scenario-btn">
          {isLastScenario ? 'See Your Score' : 'Next Scenario'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackView;