import React, { useState } from 'react';
import './MapInterface.css';

const DropZone = ({ region, onDrop, placedPhenomenon }) => {
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
    onDrop(region);
  };

  return (
    <div 
      className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${placedPhenomenon ? 'occupied' : ''}`}
      style={{ 
        left: `${region.coordinates.x}%`, 
        top: `${region.coordinates.y}%`,
        backgroundColor: region.color
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {placedPhenomenon ? (
        <div className="placed-phenomenon">
          <div className="placed-icon">{placedPhenomenon.icon}</div>
          <div className="placed-name">{placedPhenomenon.name}</div>
        </div>
      ) : (
        <div className="drop-label">
          {region.name}
        </div>
      )}
    </div>
  );
};

export default DropZone;