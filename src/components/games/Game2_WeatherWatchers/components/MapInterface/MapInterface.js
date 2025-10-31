import React, { useState } from 'react';
import PhilippineMap from './PhilippineMap';
import DraggablePhenomenon from './DraggablePhenomenon';
import './MapInterface.css';

const MapInterface = ({ phenomena, placedPhenomena, onPhenomenonPlacement, regions }) => {
  const [draggedPhenomenon, setDraggedPhenomenon] = useState(null);

  const handleDragStart = (phenomenon) => {
    setDraggedPhenomenon(phenomenon);
  };

  const handleDrop = (region) => {
    if (draggedPhenomenon) {
      onPhenomenonPlacement(draggedPhenomenon, region);
      setDraggedPhenomenon(null);
    }
  };

  const getPhenomenonForRegion = (regionName) => {
    const placement = placedPhenomena.find(p => p.region.name === regionName);
    return placement ? placement.phenomenon : null;
  };

  return (
    <div className="map-interface">
      {/* <div className="map-header">
        <h2>Philippine Weather Map</h2>
        <p>Drag weather phenomena to their correct regions on the map</p>
      </div> */}

      <div className="map-container">
        <div className="phenomena-palette">
          <h3>Weather Phenomena</h3>
          <div className="phenomena-list">
            {phenomena.map(phenomenon => (
              <DraggablePhenomenon
                key={phenomenon.id}
                phenomenon={phenomenon}
                onDragStart={handleDragStart}
                isUsed={false}
              />
            ))}
            {phenomena.length === 0 && (
              <div className="all-placed-message">
                All phenomena placed! Great work!
              </div>
            )}
          </div>
        </div>

        <div className="map-area">
          <PhilippineMap
            regions={regions}
            onDrop={handleDrop}
            placedPhenomena={placedPhenomena}
            getPhenomenonForRegion={getPhenomenonForRegion}
          />
        </div>

        <div className="map-legend">
          <h3>Map Legend</h3>
          <div className="legend-items">
            {regions.map(region => (
              <div key={region.id} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: region.color }}
                ></div>
                <span className="legend-text">{region.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-instructions">
        <p>💡 <strong>How to play:</strong> Drag each weather icon to the region where it most commonly occurs in the Philippines.</p>
      </div>
    </div>
  );
};

export default MapInterface;