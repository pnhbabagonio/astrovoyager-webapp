import React, { useState, useEffect } from 'react';
import { getRandomMonthForSeason, getSunArcPosition } from '../../../../../data/game3Data';
import MonthDisplay from './MonthDisplay';
import SunDraggable from './SunDraggable';
import ArcDropZone from './ArcDropZone';
import SeasonBackground from './SeasonBackground';
import './SeasonMatcher.css';

const SeasonMatcher = ({ seasons, onSunPlacement, completedSeasons }) => {
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isDragging, setIsDragging] = useState(false);

  const currentSeason = seasons[currentSeasonIndex];

  useEffect(() => {
    if (currentSeason) {
      const month = getRandomMonthForSeason(currentSeason.id);
      setCurrentMonth(month);
      setTimeRemaining(30);
    }
  }, [currentSeason]);

  useEffect(() => {
    if (timeRemaining > 0 && currentSeason) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentSeason) {
      // Time's up - automatic failure
      handleTimeUp();
    }
  }, [timeRemaining, currentSeason]);

  const handleSunDrop = (arcType) => {
    const isCorrect = arcType === currentSeason.sunArc;
    const timeBonus = Math.floor(timeRemaining / 3); // Bonus points for speed
    
    onSunPlacement(currentSeason, isCorrect, timeBonus);
  };

  const handleTimeUp = () => {
    onSunPlacement(currentSeason, false, 0);
  };

  const getTimeBonus = () => {
    return Math.floor(timeRemaining / 3);
  };

  if (!currentSeason || !currentMonth) {
    return (
      <div className="season-matcher completed">
        <div className="completion-message">
          <h2>🎉 All Seasons Completed! 🎉</h2>
          <p>You've successfully matched the sun position for all seasons!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="season-matcher">
      <SeasonBackground season={currentSeason} />

      <div className="matcher-header">
        <h2>Match the Sun Position</h2>
        <div className="season-info">
          <span className="season-badge" style={{ backgroundColor: currentSeason.color }}>
            {currentSeason.name}
          </span>
          <span className="time-remaining">
            ⏱️ {timeRemaining}s
          </span>
        </div>
      </div>

      <div className="matcher-content">
        <MonthDisplay 
          month={currentMonth}
          season={currentSeason}
        />

        <div className="sun-interface">
          <div className="sky-background">
            {/* Sun Arcs */}
            <div className="sun-arc high-arc"></div>
            <div className="sun-arc medium-arc"></div>
            <div className="sun-arc low-arc"></div>
            
            {/* Drop Zones */}
            <ArcDropZone 
              arcType="high" 
              onDrop={handleSunDrop}
              position={getSunArcPosition('high')}
            />
            <ArcDropZone 
              arcType="medium" 
              onDrop={handleSunDrop}
              position={getSunArcPosition('medium')}
            />
            <ArcDropZone 
              arcType="low" 
              onDrop={handleSunDrop}
              position={getSunArcPosition('low')}
            />

            {/* Draggable Sun */}
            <SunDraggable 
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          </div>
        </div>

        <div className="arc-labels">
          <div className="arc-label high">High Arc (Wet Season)</div>
          <div className="arc-label medium">Medium Arc (Transition)</div>
          <div className="arc-label low">Low Arc (Dry Season)</div>
        </div>
      </div>

      <div className="matcher-instructions">
        <p>💡 <strong>How to play:</strong> Drag the sun to the correct arc position for {currentSeason.name} ({currentSeason.months}).</p>
        <p>Time Bonus: +{getTimeBonus()} points for speed!</p>
      </div>
    </div>
  );
};

export default SeasonMatcher;