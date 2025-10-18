import React from 'react';
import './ScenarioRunner.css';

const ScenarioHeader = ({ scenario, role, scenarioNumber, totalScenarios }) => {
  return (
    <div className="scenario-header">
      <div className="scenario-meta">
        <span className="scenario-number">Scenario {scenarioNumber}/{totalScenarios}</span>
        <span className="role-badge" style={{ backgroundColor: role.color }}>
          {role.icon} {role.name}
        </span>
      </div>
      
      <h2 className="scenario-title">{scenario.title}</h2>
      
      <div className="disaster-type">
        Disaster Type: <span className="type-label">{scenario.disasterType.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ScenarioHeader;