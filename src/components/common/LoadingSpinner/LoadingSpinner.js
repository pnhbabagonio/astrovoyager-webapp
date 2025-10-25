import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <img 
          src="/assets/images/ui/rocket.png" 
          alt="Rocket Loading" 
          className="rocket-spinner"
        />
        <div className="spinner-text">{message}</div>
        <div className="loading-progress"></div>
        <div className="loading-subtext">Preparing for launch sequence...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;