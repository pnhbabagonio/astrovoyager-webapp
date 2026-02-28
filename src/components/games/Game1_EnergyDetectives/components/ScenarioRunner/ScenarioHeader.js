import './ScenarioRunner.css';

const ScenarioHeader = ({ scenarioNumber, totalScenarios, character }) => {
  return (
    <div className="scenario-header">
      <div className="scenario-meta">
        <span className="scenario-counter">Scenario {scenarioNumber} of {totalScenarios}</span>
        <span className="character-tag">
          <img 
            src={character.avatar} 
            alt={character.name}
            className="character-avatar-mini"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/assets/images/characters/default.png`;
            }}
          />
          {character.name}
        </span>
      </div>
      <div className="scenario-title">
        <h1>🌞 Sun Energy Investigation</h1>
      </div>
    </div>
  );
};

export default ScenarioHeader;