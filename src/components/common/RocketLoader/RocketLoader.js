import React, { useEffect, useState, useMemo } from 'react';
import './RocketLoader.css';

// Generate stars for background
const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));
};

// Loading tips for variety
const loadingTips = [
  "Calibrating navigation systems...",
  "Fueling rocket boosters...",
  "Scanning for asteroid fields...",
  "Plotting course through the cosmos...",
  "Initializing life support systems...",
  "Loading star charts...",
  "Syncing with mission control...",
  "Preparing educational modules...",
];

const RocketLoader = ({ onComplete, duration = 7000 }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const stars = useMemo(() => generateStars(80), []);

  useEffect(() => {
    let mounted = true;
    
    const interval = setInterval(() => {
      if (!mounted) return;
      
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLaunching(true);
          setTimeout(() => {
            if (mounted) onComplete();
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Rotate tips
    const tipInterval = setInterval(() => {
      if (mounted) {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
      }
    }, 2500);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className={`rocket-loader-modern ${isLaunching ? 'launch-complete' : ''}`}>
      {/* Starfield Background */}
      <div className="loader-starfield">
        {stars.map((star) => (
          <div
            key={star.id}
            className="loader-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="loader-nebula nebula-left"></div>
      <div className="loader-nebula nebula-right"></div>

      {/* Main Content */}
      <div className="loader-content">
        {/* Rocket with Effects */}
        <div className="rocket-assembly">
          {/* Orbital Glow Ring */}
          <div className="rocket-orbit-ring"></div>
          
          {/* Rocket Container */}
          <div className="rocket-wrapper">
            <img 
              src="/assets/images/ui/rocket.png" 
              alt="Rocket" 
              className="rocket-ship" 
            />
            
            {/* Rocket Glow */}
            <div className="rocket-glow"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="loader-title">
          <span className="title-icon">🚀</span>
          Launching Astrovoyager
          <span className="title-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </h2>

        {/* Progress Section */}
        <div className="progress-section">
          {/* Progress Bar */}
          <div className="progress-track">
            <div 
              className="progress-fill-modern" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
              <div className="progress-shine"></div>
            </div>
            {/* Milestone Markers */}
            <div className="milestone-markers">
              <div className={`milestone ${progress >= 25 ? 'reached' : ''}`} style={{ left: '25%' }}></div>
              <div className={`milestone ${progress >= 50 ? 'reached' : ''}`} style={{ left: '50%' }}></div>
              <div className={`milestone ${progress >= 75 ? 'reached' : ''}`} style={{ left: '75%' }}></div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{progress}%</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className={`stat-value status ${progress >= 100 ? 'complete' : 'loading'}`}>
                {progress >= 100 ? 'Ready!' : 'Loading'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Tip */}
        <div className="loading-tip-modern">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{loadingTips[currentTip]}</span>
        </div>

        {/* System Status */}
        <div className="system-status">
          <div className={`status-item ${progress >= 20 ? 'active' : ''}`}>
            <span className="status-icon">📡</span>
            <span>Navigation</span>
          </div>
          <div className={`status-item ${progress >= 40 ? 'active' : ''}`}>
            <span className="status-icon">⚡</span>
            <span>Power</span>
          </div>
          <div className={`status-item ${progress >= 60 ? 'active' : ''}`}>
            <span className="status-icon">🛡️</span>
            <span>Shields</span>
          </div>
          <div className={`status-item ${progress >= 80 ? 'active' : ''}`}>
            <span className="status-icon">🎯</span>
            <span>Mission</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketLoader;