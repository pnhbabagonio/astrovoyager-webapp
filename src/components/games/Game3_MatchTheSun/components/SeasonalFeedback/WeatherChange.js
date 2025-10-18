import React from 'react';
import './SeasonalFeedback.css';

const WeatherChange = ({ season, explanation }) => {
  const getSeasonIcon = (seasonName) => {
    const icons = {
      'Wet Season': '🌧️',
      'Dry Season': '☀️',
      'Transition Season': '🌤️'
    };
    return icons[season.name] || '🌍';
  };

  return (
    <div className="weather-change">
      <div className="weather-header">
        <span className="season-icon">{getSeasonIcon(season.name)}</span>
        <h3>Seasonal Science: {season.name}</h3>
      </div>
      
      <div className="weather-content">
        <p>{explanation}</p>
        
        <div className="season-details">
          <div className="detail-item">
            <strong>Months:</strong> {season.months}
          </div>
          <div className="detail-item">
            <strong>Sun Position:</strong> {season.sunArc} arc
          </div>
          <div className="detail-item">
            <strong>Typical Weather:</strong> {season.typicalWeather}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherChange;