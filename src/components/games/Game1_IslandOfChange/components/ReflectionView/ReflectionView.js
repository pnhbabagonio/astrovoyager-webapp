import './ReflectionView.css';

const ReflectionView = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onNext, 
  isLastQuestion 
}) => {
  return (
    <div className="reflection-view">
      <div className="reflection-header">
        <div className="reflection-badge">
          Reflection Question {questionNumber}/{totalQuestions}
        </div>
        <h2>Time to Reflect & Discuss</h2>
      </div>
      
      <div className="reflection-content">
        <div className="reflection-question-card">
          <div className="question-text">{question}</div>
          <div className="discussion-prompt">
            <h3>💭 Discussion Prompt:</h3>
            <p>Discuss this question with your classmates. Share your thoughts and listen to others!</p>
            <ul className="discussion-tips">
              <li>Take turns sharing your answer</li>
              <li>Listen carefully to others</li>
              <li>Build on each other's ideas</li>
              <li>Connect to real-life examples</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="reflection-footer">
        <button onClick={onNext} className="next-reflection-btn">
          {isLastQuestion ? 'Complete Game' : 'Next Reflection Question'}
        </button>
      </div>
    </div>
  );
};

export default ReflectionView;