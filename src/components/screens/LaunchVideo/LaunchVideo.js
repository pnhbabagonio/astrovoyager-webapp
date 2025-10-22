import React, { useEffect, useRef } from 'react';
import './LaunchVideo.css';

const LaunchVideo = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      onComplete();
    };

    const handleVideoError = () => {
      console.error('Video failed to load, proceeding to mission map');
      onComplete();
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);
      
      // Try to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Autoplay failed:', error);
          // If autoplay fails, user will need to interact
          video.controls = true;
        }
      };
      
      playVideo();
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
      }
    };
  }, [onComplete]);

  const handleSkipVideo = () => {
    onComplete();
  };

  return (
    <div className="launch-video-container">
      <div className="video-wrapper">
        <iframe
          ref={videoRef}
          src="https://www.youtube.com/embed/XPMzSYzKImM?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0"
          title="Astrovoyager Launch Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="launch-video"
        ></iframe>
        
        <button 
          onClick={handleSkipVideo}
          className="skip-button"
        >
          Skip Video
        </button>
      </div>
    </div>
  );
};

export default LaunchVideo;