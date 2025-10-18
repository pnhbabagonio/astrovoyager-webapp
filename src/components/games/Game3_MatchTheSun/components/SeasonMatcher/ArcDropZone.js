import React, { useState } from 'react';
import './SeasonMatcher.css';

const ArcDropZone = ({ arcType, onDrop, position }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(arcType);
  };

  const getArcLabel = () => {
    const labels = {
      high: 'High',
      medium: 'Medium', 
      low: 'Low'
    };
    return labels[arcType];
  };

  return (
    <div 
      className={`arc-drop-zone ${arcType} ${isDragOver ? 'drag-over' : ''}`}
      style={position}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="arc-label">{getArcLabel()} Arc</div>
    </div>
  );
};

export default ArcDropZone;