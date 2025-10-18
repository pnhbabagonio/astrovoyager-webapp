import React, { useState } from 'react';
import { getScenariosForPhenomenon } from '../../../../../data/game2Data';
import ScenarioQuestion from './ScenarioQuestion';
import ScenarioChoices from './ScenarioChoices';
import './ScenarioChallenge.css';

const ScenarioChallenge = ({ phenomenon, onComplete }) => {
  const scenarios = getScenariosForPhenomenon(phenomenon.id);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);

  const currentScenario = scenarios[currentScenarioIndex];

  const handleChoiceSelect = (choice) => {
    if (selectedChoices.includes(choice)) {
      // Deselect if already selected
      setSelectedChoices(selectedChoices.filter(c => c !== choice));
    } else {
      // Select new choice
      setSelectedChoices([...selectedChoices, choice]);
    }
  };

  const handleSubmit = () => {
    if (selectedChoices.length === 0) return;

    const correctChoices = currentScenario.choices.filter(choice => choice.correct);
    const selectedCorrect = selectedChoices.filter(choice => choice.correct);
    
    const points = Math.round((selectedCorrect.length / correctChoices.length) * 10);
    const isPerfect = selectedCorrect.length === correctChoices.length && 
                     selectedChoices.length === correctChoices.length;

    const result = {
      scenario: currentScenario,
      selectedChoices,
      points: isPerfect ? 10 : points,
      isPerfect,
      correctChoices: correctChoices,
      explanation: `You selected ${selectedCorrect.length} out of ${correctChoices.length} correct actions.`
    };

    onComplete(result);
  };

  return (
    <div className="scenario-challenge">
      <div className="scenario-header">
        <div className="phenomenon-badge" style={{ backgroundColor: phenomenon.color }}>
          {phenomenon.icon} {phenomenon.name} Challenge
        </div>
        <h2>Real-World Scenario</h2>
      </div>

      <div className="scenario-content">
        <ScenarioQuestion 
          question={currentScenario.questionText}
          phenomenon={phenomenon}
        />

        <ScenarioChoices 
          choices={currentScenario.choices}
          selectedChoices={selectedChoices}
          onChoiceSelect={handleChoiceSelect}
        />

        <div className="scenario-actions">
          <button 
            onClick={handleSubmit}
            disabled={selectedChoices.length === 0}
            className="submit-button"
          >
            Submit Answers
          </button>
          <div className="selection-info">
            Selected: {selectedChoices.length} action(s)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioChallenge;