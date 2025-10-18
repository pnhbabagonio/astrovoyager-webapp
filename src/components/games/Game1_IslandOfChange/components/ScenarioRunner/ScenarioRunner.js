import React from 'react';
import { getChoicesForScenarioAndRole } from '../../../../../data/game1Data';
import ScenarioHeader from './ScenarioHeader';
import ChoicesGrid from './ChoicesGrid';
import './ScenarioRunner.css';

const ScenarioRunner = ({ scenario, role, onChoiceSelect, scenarioNumber, totalScenarios }) => {
  const choices = getChoicesForScenarioAndRole(scenario.id, role.id);

  return (
    <div className="scenario-runner">
      <ScenarioHeader 
        scenario={scenario}
        role={role}
        scenarioNumber={scenarioNumber}
        totalScenarios={totalScenarios}
      />
      
      <div className="scenario-content">
        <div className="scenario-description">
          <p>{scenario.description}</p>
        </div>

        <ChoicesGrid 
          choices={choices}
          onChoiceSelect={onChoiceSelect}
        />
      </div>
    </div>
  );
};

export default ScenarioRunner;