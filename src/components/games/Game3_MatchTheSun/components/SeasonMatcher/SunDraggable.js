import React from 'react';
import './SeasonMatcher.css';

const SunDraggable = ({ onDragStart, onDragEnd }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'sun');
    onDragStart();
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div 
      className="sun-draggable"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="sun-icon">☀️</div>
      <div className="sun-glow"></div>
    </div>
  );
};

export default SunDraggable;