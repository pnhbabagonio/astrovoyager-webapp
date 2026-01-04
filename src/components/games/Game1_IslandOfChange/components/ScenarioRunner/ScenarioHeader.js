import './ScenarioRunner.css';

const ScenarioHeader = ({ scenarioNumber, totalScenarios, character }) => {
  return (
    <div className="scenario-header">
      <div className="scenario-meta">
        <span className="scenario-counter">Scenario {scenarioNumber} of {totalScenarios}</span>
        <span className="character-tag">
          {character.avatar} {character.name} • Energy Detective
        </span>
      </div>
      <div className="scenario-title">
        <h1>🌞 Sun Energy Investigation</h1>
      </div>
    </div>
  );
};

export default ScenarioHeader;