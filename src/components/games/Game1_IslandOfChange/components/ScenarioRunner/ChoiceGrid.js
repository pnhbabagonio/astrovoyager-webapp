import './ScenarioRunner.css';

const ChoiceGrid = ({ choices, onChoiceSelect }) => {
  return (
    <div className="choice-grid">
      {choices.map((choice) => (
        <button
          key={choice.id}
          className={`choice-button ${choice.isCorrect ? 'correct-choice' : 'incorrect-choice'}`}
          onClick={() => onChoiceSelect(choice)}
        >
          <div className="choice-content">
            <div className="choice-label">
              {choice.isCorrect ? '✅' : '❌'}
            </div>
            <div className="choice-text">{choice.text}</div>
          </div>
          <div className="choice-hint">
            Tap to select this answer
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChoiceGrid;