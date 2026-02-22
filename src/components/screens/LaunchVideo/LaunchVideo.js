import React, { useEffect, useRef, useState } from 'react';
import './LaunchVideo.css';

const LaunchVideo = ({ onSkip }) => {
  const videoRef = useRef(null);
  const [canSkip, setCanSkip] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false); // Fixed: now we have both value and setter
  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video properties for autoplay
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    // Try to autoplay the video
    const playVideo = async () => {
      try {
        await video.play();
        console.log('Video autoplay successful');
      } catch (err) {
        console.warn('Autoplay was prevented:', err.message);
        setNeedsInteraction(true);
      }
    };

    playVideo();

    // Allow skipping after 2 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    // Cleanup function
    return () => {
      clearTimeout(skipTimer);
    };
  }, []);

  // Enable sound on first interaction
  const handleUserInteraction = () => {
    if (soundEnabled && !needsInteraction) return;

    const video = videoRef.current;
    if (!video) return;

    // If we need interaction to play video (autoplay was blocked)
    if (needsInteraction) {
      video.play()
        .then(() => {
          console.log('Video started via user interaction');
          setNeedsInteraction(false);
        })
        .catch(err => {
          console.warn('Video play after interaction failed:', err);
        });
    }

    // Enable sound
    if (!soundEnabled) {
      video.muted = false;
      video.volume = 0.5; // Start with moderate volume
      setSoundEnabled(true);
    }
  };

  // Skip handler - goes to mission map
  const handleSkip = () => {
    console.log('LaunchVideo: Skip to mission map');
    if (typeof onSkip === 'function') {
      // Call the parent's onSkip function to navigate to mission map
      onSkip();
    } else {
      console.error('LaunchVideo: onSkip prop is not a function');
    }
  };

  // Handle video ended - goes to mission map
  const handleVideoEnded = () => {
    console.log('LaunchVideo: Video ended, going to mission map');
    handleSkip();
  };

  // Handle video error - skip to mission map on error
  const handleVideoError = () => {
    console.error('LaunchVideo: Video error, skipping to mission map');
    handleSkip();
  };

  // Handle manual play if autoplay was blocked
  const handleManualPlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.play()
        .then(() => {
          setNeedsInteraction(false);
        })
        .catch(err => {
          console.warn('Manual play failed:', err);
        });
    }
  };

  return (
    <div
      className="launch-video-screen"
      onClick={handleUserInteraction}
    >
      <video
        ref={videoRef}
        className="launch-video"
        src={`${process.env.PUBLIC_URL}/assets/videos/little-einstein-video.mp4`}
        preload="auto"
        playsInline
        muted
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        onLoadedMetadata={() => {
          console.log('Video metadata loaded');
          setVideoLoaded(true); // Now this works correctly
        }}
      />

      {/* Manual play prompt if autoplay was blocked */}
      {needsInteraction && (
        <div 
          className="play-prompt-overlay"
          onClick={handleManualPlay}
        >
          <div className="play-prompt">
            <div className="play-icon-large">▶</div>
            <div className="play-text">Tap to Play Video</div>
          </div>
        </div>
      )}

      {/* Skip button */}
      {canSkip && (
        <div
          className={`skip-button ${pressed ? 'pressed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
        >
          <span className="skip-icon">🚀</span>
          <span className="skip-text">SKIP INTRO</span>
        </div>
      )}

      {/* Sound instruction (only show if video is playing and sound is off) */}
      {!soundEnabled && !needsInteraction && (
        <div className="tap-for-sound">
          🔊 Tap anywhere to enable sound
        </div>
      )}
    </div>
  );
};

export default LaunchVideo;