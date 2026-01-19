import React, { useState, useEffect, useMemo } from 'react';
import './LoadingSpinner.css';

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

// Generate shooting stars
const generateShootingStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 3 + Math.random() * 2,
    duration: Math.random() * 1 + 0.8,
    top: `${Math.random() * 40}%`,
    left: `${Math.random() * 30 + 5}%`,
  }));
};

const LoadingSpinner = ({ message = "Loading..." }) => {
  const [progress, setProgress] = useState(0);
  const stars = useMemo(() => generateStars(60), []);
  const shootingStars = useMemo(() => generateShootingStars(3), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-spinner-overlay-modern">
      {/* Starfield Background */}
      <div className="spinner-starfield">
        {stars.map((star) => (
          <div
            key={star.id}
            className="spinner-star"
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

      {/* Shooting Stars */}
      <div className="spinner-shooting-stars">
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="spinner-shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="spinner-nebula spinner-nebula-1"></div>
      <div className="spinner-nebula spinner-nebula-2"></div>

      {/* Main Content */}
      <div className="loading-spinner-modern">
        {/* Rocket with Glow */}
        <div className="rocket-container-modern">
          <div className="rocket-orbit"></div>
          <img 
            src="/assets/images/ui/rocket.png" 
            alt="Rocket Loading" 
            className="rocket-spinner-modern"
          />
          <div className="rocket-glow-effect"></div>
        </div>

        {/* Title */}
        <h2 className="spinner-title">
          {message}
          <span className="spinner-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </h2>

        {/* Progress Bar */}
        <div className="spinner-progress-container">
          <div className="spinner-progress-track">
            <div 
              className="spinner-progress-fill" 
              style={{ width: `${progress}%` }}
            >
              <div className="spinner-progress-glow"></div>
            </div>
          </div>
          <div className="spinner-progress-text">{progress}%</div>
        </div>

        {/* Subtext */}
        <p className="spinner-subtext">
          <span className="subtext-icon">✨</span>
          Preparing for launch sequence
          <span className="subtext-icon">✨</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;