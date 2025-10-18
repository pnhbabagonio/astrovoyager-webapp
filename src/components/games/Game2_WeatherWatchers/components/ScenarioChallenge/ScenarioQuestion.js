import React from 'react';
import './ScenarioChallenge.css';

const ScenarioQuestion = ({ question, phenomenon }) => {
  return (
    <div className="scenario-question">
      <div className="question-header">
        <div className="phenomenon-icon">{phenomenon.icon}</div>
        <h3>Scenario Question</h3>
      </div>
      <div className="question-text">
        {question}
      </div>
      <div className="question-instruction">
        Select all the correct actions you would take in this situation:
      </div>
    </div>
  );
};

export default ScenarioQuestion;