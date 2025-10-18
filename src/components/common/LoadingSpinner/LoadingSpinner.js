import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="spinner-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;