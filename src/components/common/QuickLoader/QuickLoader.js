import React, { useEffect, useState } from 'react';
import './QuickLoader.css';

const QuickLoader = ({ onComplete, message = "Loading..." }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 1000); // Only show for 1 second

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="quick-loader">
      <div className="quick-loader-content">
        <div className="spinning-logo">🚀</div>
        <div className="quick-loader-text">{message}</div>
      </div>
    </div>
  );
};

export default QuickLoader;