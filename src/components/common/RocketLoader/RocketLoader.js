// src/components/common/RocketLoader/RocketLoader.js
import { useEffect, useState, useMemo, useRef } from 'react';
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

const RocketLoader = ({ onComplete, duration = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const mountedRef = useRef(true);
  const completionTimeoutRef = useRef(null);
  const onCompleteCalledRef = useRef(false);

  const stars = useMemo(() => generateStars(80), []);

  // Log when component mounts
  useEffect(() => {
    console.log('🚀 RocketLoader mounted with duration:', duration);
    mountedRef.current = true;
    onCompleteCalledRef.current = false;
    
    return () => {
      console.log('🚀 RocketLoader unmounting');
      mountedRef.current = false;
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [duration]);

  // Progress interval
  useEffect(() => {
    console.log('Starting progress interval');
    
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;
      
      setProgress(prev => {
        const newProgress = prev + 2;
        console.log('Progress:', newProgress);
        
        if (newProgress >= 100) {
          console.log('Progress reached 100%, clearing interval');
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, duration / 50);

    // Rotate tips
    const tipInterval = setInterval(() => {
      if (mountedRef.current) {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
      }
    }, 2500);

    return () => {
      console.log('Cleaning up intervals');
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [duration]);

  // Handle completion when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && mountedRef.current && !onCompleteCalledRef.current) {
      console.log('🎯 Progress reached 100%, triggering launch sequence');
      setIsLaunching(true);
      onCompleteCalledRef.current = true;
      
      // Clear any existing timeout
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      
      // Set new timeout for completion
      completionTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          console.log('✅ Calling onComplete callback');
          if (onComplete) {
            onComplete();
          } else {
            console.warn('⚠️ onComplete prop is not provided');
          }
        }
      }, 800);
    }
  }, [progress, onComplete]);

  // Force completion after maximum time (safety net)
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current && progress < 100 && !onCompleteCalledRef.current) {
        console.log('⚠️ Safety timeout triggered - forcing completion');
        setProgress(100);
      }
    }, duration + 2000); // Add 2 seconds buffer

    return () => clearTimeout(safetyTimeout);
  }, [duration, progress]);

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
              animation: `twinkle ${star.duration}s infinite ${star.delay}s`,
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
              src={`${process.env.PUBLIC_URL}/assets/images/ui/rocket.png`}
              alt="Rocket" 
              className="rocket-ship"
              onError={(e) => {
                console.error('Rocket image failed to load');
                e.target.style.display = 'none';
                // Add a fallback div rocket
                const parent = e.target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'rocket-fallback';
                  fallback.innerHTML = '🚀';
                  parent.appendChild(fallback);
                }
              }}
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
              <span className="stat-value">{Math.round(progress)}%</span>
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