import React, { useEffect, useState } from 'react';
import './RocketLoader.css';

const RocketLoader = ({ onComplete, duration = 2000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const interval = setInterval(() => {
      if (!mounted) return;
      
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (mounted) onComplete();
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [duration, onComplete]);

  return (
    <div className="rocket-loader-container"> {/* Added this wrapper div */}
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
        <div className="loading-tip">
          💡 <em>Loading educational content...</em>
        </div>
      </div>
    </div>
  );
};

export default RocketLoader;