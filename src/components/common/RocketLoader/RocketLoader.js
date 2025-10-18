import React, { useEffect, useState } from 'react';
import './RocketLoader.css';

const RocketLoader = ({ onComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="rocket-loader">
      <div className="rocket-container">
        <div className="rocket">🚀</div>
        <div className="flames">
          <div className="flame flame-1"></div>
          <div className="flame flame-2"></div>
          <div className="flame flame-3"></div>
        </div>
      </div>
      <div className="loader-text">Launching Astrovoyager...</div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress-text">{progress}%</div>
    </div>
  );
};

export default RocketLoader;