import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const AudioContext = createContext();

const initialState = {
  backgroundMusic: {
    enabled: true,
    volume: 0.3,
    currentTrack: null,
    playing: false
  },
  soundEffects: {
    enabled: true,
    volume: 0.7
  },
  voiceovers: {
    enabled: true,
    volume: 0.8
  },
  muted: false
};

function audioReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_MUTE':
      return {
        ...state,
        muted: !state.muted
      };
    
    case 'SET_BACKGROUND_MUSIC':
      return {
        ...state,
        backgroundMusic: {
          ...state.backgroundMusic,
          ...action.payload
        }
      };
    
    case 'SET_SOUND_EFFECTS':
      return {
        ...state,
        soundEffects: {
          ...state.soundEffects,
          ...action.payload
        }
      };
    
    case 'SET_VOICEOVERS':
      return {
        ...state,
        voiceovers: {
          ...state.voiceovers,
          ...action.payload
        }
      };
    
    case 'SET_AUDIO_ENABLED':
      return {
        ...state,
        backgroundMusic: { ...state.backgroundMusic, enabled: action.payload },
        soundEffects: { ...state.soundEffects, enabled: action.payload },
        voiceovers: { ...state.voiceovers, enabled: action.payload },
        muted: !action.payload
      };
    
    default:
      return state;
  }
}

export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioInstances = React.useRef(new Map());

  // Initialize Howler
  useEffect(() => {
    Howler.autoUnlock = true;
    Howler.autoSuspend = false;
    
    return () => {
      // Cleanup all audio instances
      audioInstances.current.forEach(sound => sound.unload());
    };
  }, []);

  // Apply mute state to Howler
  useEffect(() => {
    Howler.mute(state.muted);
  }, [state.muted]);

  // Apply volume to background music
  useEffect(() => {
    audioInstances.current.forEach((sound, key) => {
      if (key.startsWith('bg_')) {
        sound.volume(state.backgroundMusic.volume);
      }
    });
  }, [state.backgroundMusic.volume]);

  const playBackgroundMusic = (trackName, options = {}) => {
    if (!state.backgroundMusic.enabled || state.muted) return;

    const soundKey = `bg_${trackName}`;
    
    // Stop current background music
    audioInstances.current.forEach((sound, key) => {
      if (key.startsWith('bg_') && key !== soundKey) {
        sound.stop();
      }
    });

    // Create or get sound instance
    let sound = audioInstances.current.get(soundKey);
    if (!sound) {
      // For now, use placeholder URLs - replace with actual files later
      const trackUrls = {
        space: ['https://assets.mixkit.co/music/preview/mixkit-space-game-668.mp3'],
        adventure: ['https://assets.mixkit.co/music/preview/mixkit-adventure-96.mp3'],
        victory: ['https://assets.mixkit.co/music/preview/mixkit-victory-110.mp3']
      };

      sound = new Howl({
        src: trackUrls[trackName] || trackUrls.space,
        loop: true,
        volume: state.backgroundMusic.volume,
        onloaderror: (id, error) => {
          console.warn(`Failed to load background music ${trackName}:`, error);
        }
      });
      
      audioInstances.current.set(soundKey, sound);
    }

    sound.play();
    dispatch({
      type: 'SET_BACKGROUND_MUSIC',
      payload: { currentTrack: trackName, playing: true }
    });
  };

  const stopBackgroundMusic = () => {
    audioInstances.current.forEach((sound, key) => {
      if (key.startsWith('bg_')) {
        sound.stop();
      }
    });
    
    dispatch({
      type: 'SET_BACKGROUND_MUSIC',
      payload: { currentTrack: null, playing: false }
    });
  };

  const pauseBackgroundMusic = () => {
    audioInstances.current.forEach((sound, key) => {
      if (key.startsWith('bg_')) {
        sound.pause();
      }
    });
    
    dispatch({
      type: 'SET_BACKGROUND_MUSIC',
      payload: { playing: false }
    });
  };

  const playSoundEffect = (effectName, options = {}) => {
    if (!state.soundEffects.enabled || state.muted) return;

    const soundKey = `sfx_${effectName}`;
    let sound = audioInstances.current.get(soundKey);

    if (!sound) {
      // Placeholder sound effects - replace with actual files later
      const effectUrls = {
        buttonClick: ['https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'],
        success: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'],
        error: ['https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'],
        rocketLaunch: ['https://assets.mixkit.co/sfx/preview/mixkit-rocket-whoosh-1114.mp3'],
        gameStart: ['https://assets.mixkit.co/sfx/preview/mixkit-game-show-intro-331.mp3']
      };

      sound = new Howl({
        src: effectUrls[effectName] || effectUrls.buttonClick,
        volume: state.soundEffects.volume,
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound effect ${effectName}:`, error);
        }
      });
      
      audioInstances.current.set(soundKey, sound);
    }

    sound.play();
  };

  const playVoiceover = (voiceName, options = {}) => {
    if (!state.voiceovers.enabled || state.muted) return;

    const soundKey = `voice_${voiceName}`;
    let sound = audioInstances.current.get(soundKey);

    if (!sound) {
      // Placeholder voiceovers - replace with actual files later
      const voiceUrls = {
        welcome: ['https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'],
        roleSelection: ['https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'],
        gameInstruction: ['https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3']
      };

      sound = new Howl({
        src: voiceUrls[voiceName] || voiceUrls.welcome,
        volume: state.voiceovers.volume,
        onloaderror: (id, error) => {
          console.warn(`Failed to load voiceover ${voiceName}:`, error);
        }
      });
      
      audioInstances.current.set(soundKey, sound);
    }

    sound.play();
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const setAudioEnabled = (enabled) => {
    dispatch({ type: 'SET_AUDIO_ENABLED', payload: enabled });
  };

  const value = {
    state,
    actions: {
      playBackgroundMusic,
      stopBackgroundMusic,
      pauseBackgroundMusic,
      playSoundEffect,
      playVoiceover,
      toggleMute,
      setAudioEnabled
    }
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}