import React from 'react';
import './MapInterface.css';

const DraggablePhenomenon = ({ phenomenon, onDragStart, isUsed }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', phenomenon.id);
    onDragStart(phenomenon);
  };

  return (
    <div 
      className={`draggable-phenomenon ${isUsed ? 'used' : ''}`}
      draggable={!isUsed}
      onDragStart={handleDragStart}
      style={{ borderColor: phenomenon.color }}
    >
      <div className="phenomenon-icon">{phenomenon.icon}</div>
      <div className="phenomenon-info">
        <div className="phenomenon-name">{phenomenon.name}</div>
        <div className="phenomenon-desc">{phenomenon.description}</div>
      </div>
      {!isUsed && <div className="drag-hint">Drag me!</div>}
    </div>
  );
};

export default DraggablePhenomenon;