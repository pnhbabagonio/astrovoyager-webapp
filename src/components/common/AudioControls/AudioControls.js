import React from 'react';
import { useAudio } from '../../../contexts/AudioContext';
import './AudioControls.css';

const AudioControls = () => {
  const { state, actions } = useAudio();

  const toggleMute = () => {
    actions.toggleMute();
  };

  return (
    <div className="audio-controls">
      <button 
        onClick={toggleMute}
        className={`audio-button ${state.muted ? 'muted' : 'unmuted'}`}
        title={state.muted ? 'Unmute audio' : 'Mute audio'}
      >
        {state.muted ? '🔇' : '🔊'}
      </button>
      <div className="audio-tooltip">
        {state.muted ? 'Sound Off' : 'Sound On'}
      </div>
    </div>
  );
};

export default AudioControls;