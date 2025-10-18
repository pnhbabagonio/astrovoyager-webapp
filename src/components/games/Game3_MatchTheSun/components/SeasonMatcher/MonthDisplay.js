import React from 'react';
import './SeasonMatcher.css';

const MonthDisplay = ({ month, season }) => {
  return (
    <div className="month-display">
      <div className="month-card">
        <div className="month-name">{month.name}</div>
        <div className="season-info">
          <span className="season-name" style={{ color: season.color }}>
            {season.name}
          </span>
          <span className="season-months">({season.months})</span>
        </div>
        <div className="weather-description">
          {season.typicalWeather}
        </div>
      </div>
    </div>
  );
};

export default MonthDisplay;