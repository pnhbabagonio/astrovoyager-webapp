import React from 'react';
import './ConsequenceView.css';

const GeographyExplanation = ({ explanation, disasterType, role }) => {
  const getDisasterIcon = (type) => {
    switch (type) {
      case 'typhoon': return '🌀';
      case 'volcanic': return '🌋';
      case 'drought': return '☀️';
      default: return '🌍';
    }
  };

  return (
    <div className="geography-explanation">
      <div className="explanation-header">
        <span className="disaster-icon">{getDisasterIcon(disasterType)}</span>
        <h3>Geographical Context</h3>
      </div>
      
      <div className="explanation-content">
        <p>{explanation}</p>
        
        <div className="role-connection">
          <strong>As a {role.name}:</strong> Your role is crucial because {role.description.toLowerCase()}.
          Understanding Philippine geography helps you make better decisions for community resilience.
        </div>
      </div>
    </div>
  );
};

export default GeographyExplanation;