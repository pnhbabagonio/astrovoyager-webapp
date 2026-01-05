import './ScenarioRunner.css';

const ChoiceGrid = ({ choices, onChoiceSelect }) => {
  return (
    <div className="choice-grid">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          className="choice-button"
          onClick={() => onChoiceSelect(choice)}
        >
          <div className="choice-content">
            <div className="choice-label">
              {String.fromCharCode(65 + index)} {/* A, B, C, etc. */}
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