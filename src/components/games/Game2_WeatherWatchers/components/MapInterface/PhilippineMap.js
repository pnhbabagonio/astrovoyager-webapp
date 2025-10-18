import React from 'react';
import DropZone from './DropZone';
import './MapInterface.css';

const PhilippineMap = ({ regions, onDrop, placedPhenomena, getPhenomenonForRegion }) => {
  return (
    <div className="philippine-map">
      <div className="map-background">
        {/* Simplified Philippine map outline - in practice, you'd use an SVG */}
        <div className="map-outline">
          <div className="luzon"></div>
          <div className="visayas"></div>
          <div className="mindanao"></div>
        </div>

        {/* Drop zones for each region */}
        {regions.map(region => (
          <DropZone
            key={region.id}
            region={region}
            onDrop={onDrop}
            placedPhenomenon={getPhenomenonForRegion(region.name)}
          />
        ))}
      </div>

      <div className="map-title">Philippines Weather Map</div>
    </div>
  );
};

export default PhilippineMap;