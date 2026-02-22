import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import RocketLoader from './components/common/RocketLoader/RocketLoader';
import LaunchScreen from './components/screens/LaunchScreen/LaunchScreen';
import MissionMap from './components/screens/MissionMap/MissionMap';
import Game1Root from './components/games/Game1_EnergyDetectives/Game1Root';
import Game2Root from './components/games/Game2_TiltQuest/Game2Root';
import Game3Root from './components/games/Game3_SeasonNavigator/Game3Root';
import EndCredits from './components/screens/EndCredits/EndCredits';
import AudioControls from './components/common/AudioControls/AudioControls';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import LaunchVideo from './components/screens/LaunchVideo/LaunchVideo';
import DataExport from './components/admin/DataExport';

import './styles/globals/reset.css';
import './styles/globals/variables.css';
import './styles/globals/animations.css';
import './App.css';

function AppContent() {
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();
  const [showLaunchVideo, setShowLaunchVideo] = useState(false);
  const [showJourneyLoading, setShowJourneyLoading] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  
  // Refs for timeout management
  const loadingTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Debug: Log state changes
  useEffect(() => {
    console.log('Current view:', gameState.currentView);
    console.log('isInitialLoad:', gameState.isInitialLoad);
    console.log('isDataLoaded:', gameState.isDataLoaded);
  }, [gameState.currentView, gameState.isInitialLoad, gameState.isDataLoaded]);

  // Monitor loading states
  useEffect(() => {
    console.log('showJourneyLoading changed to:', showJourneyLoading);
  }, [showJourneyLoading]);

  useEffect(() => {
    console.log('showLaunchVideo changed to:', showLaunchVideo);
  }, [showLaunchVideo]);

  // Set mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Detect page refresh and ensure we start from loading screen
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear any session flags on unload
      sessionStorage.removeItem('astrovoyager_session_active');
    };

    // Check if this is a fresh page load (not a navigation within the app)
    const isPageRefresh = !sessionStorage.getItem('astrovoyager_session_active');
    
    if (isPageRefresh) {
      // This is a fresh page load/refresh - reset to loading
      console.log('🔄 Page refreshed - resetting to loading screen');
      gameDispatch({ type: 'SET_VIEW', payload: 'loading' });
      gameDispatch({ type: 'SET_INITIAL_LOAD_COMPLETE', payload: true });
    }
    
    // Mark that we're in an active session
    sessionStorage.setItem('astrovoyager_session_active', 'true');

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameDispatch]);

  // DEVELOPMENT SHORTCUTS: Ctrl+Shift+E to jump to end credits
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Shift+E to jump to end credits (development only)
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        console.log('🎮 DEV: Jumping to end credits');
        
        // Set all games as completed with high scores
        const dummyScores = {
          game1: { completed: true, score: 950, maxScore: 1000, resiliencePoints: 500 },
          game2: { completed: true, score: 900, maxScore: 1000, preparednessPoints: 450 },
          game3: { completed: true, score: 920, maxScore: 1000, accuracyPoints: 480 }
        };

        // Update progress for all games
        Object.keys(dummyScores).forEach(game => {
          gameDispatch({
            type: 'UPDATE_PROGRESS',
            payload: { game, progress: dummyScores[game] }
          });
          
          playerActions.updatePlayerProgress(game, dummyScores[game]);
        });

        // Mark as not initial load to allow navigation
        gameDispatch({ type: 'SET_INITIAL_LOAD_COMPLETE', payload: false });

        // Go to end credits
        gameDispatch({ type: 'SET_VIEW', payload: 'end-credits' });
        audioActions.playSoundEffect('success');
      }
      
      // Ctrl+Shift+M to go back to mission map
      if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        event.preventDefault();
        console.log('🎮 DEV: Going to mission map');
        gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
      }
      
      // Ctrl+Shift+R to reset game
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        console.log('🎮 DEV: Resetting game');
        gameDispatch({ type: 'RESET_GAME' });
      }
      
      // Ctrl+Shift+L to go to launch screen
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        console.log('🎮 DEV: Going to launch screen');
        gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
        gameDispatch({ type: 'SET_INITIAL_LOAD_COMPLETE', payload: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameDispatch, playerActions, audioActions]);

  // Background music management
  useEffect(() => {
    if (!gameState.audioEnabled) return;

    if (showLaunchVideo || showJourneyLoading) {
      audioActions.stopBackgroundMusic();
      return;
    }

    switch (gameState.currentView) {
      case 'launch':
        audioActions.playBackgroundMusic('space');
        break;
      case 'mission-map':
        audioActions.playBackgroundMusic('space');
        break;
      case 'game1':
      case 'game2':
      case 'game3':
        audioActions.playBackgroundMusic('adventure');
        break;
      case 'end-credits':
        // Don't play background music here - EndCredits component handles its own music
        audioActions.stopBackgroundMusic();
        break;
      default:
        audioActions.stopBackgroundMusic();
    }
  }, [
    gameState.currentView,
    showLaunchVideo,
    showJourneyLoading,
    gameState.audioEnabled,
    audioActions
  ]);

  // FIXED: Handle loading complete with proper state transition
  const handleLoadingComplete = () => {
    console.log('🚀 Loading complete, transitioning to launch screen');
    
    // Clear initial load flag
    gameDispatch({ type: 'SET_INITIAL_LOAD_COMPLETE', payload: false });
    
    // Set view to launch
    gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
    
    // Play welcome sound
    setTimeout(() => {
      audioActions.playSoundEffect('success');
    }, 500);
  };

  const handleLaunch = async (playerName) => {
    console.log('Launch initiated with name:', playerName);
    gameDispatch({ type: 'SET_LOADING', payload: true });
    audioActions.playSoundEffect('rocketLaunch');
    
    try {
      // Validate player name
      if (!playerName || !playerName.trim()) {
        throw new Error('Please enter your astronaut name');
      }

      const trimmedName = playerName.trim();
      
      const playerData = {
        name: trimmedName,
        encodedName: `Astronaut ${trimmedName}`,
        sessionId: `session_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      console.log('Attempting to create player with data:', playerData);
      
      // Try to create player in IndexedDB
      let createdPlayer;
      try {
        createdPlayer = await playerActions.createPlayer(playerData);
        console.log('Player created successfully:', createdPlayer);
      } catch (dbError) {
        console.error('IndexedDB error details:', dbError);
        
        // Check if it's a specific IndexedDB error
        if (dbError.name === 'VersionError') {
          throw new Error('Database version mismatch. Please clear your browser data and refresh.');
        } else if (dbError.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please clear some space and try again.');
        } else if (dbError.name === 'InvalidStateError') {
          throw new Error('Database is not available. Please check your browser settings.');
        } else {
          // Generic error with more details
          throw new Error(`Failed to save player data: ${dbError.message || 'Unknown error'}`);
        }
      }
      
      // Store player data in both contexts
      setPlayerData(createdPlayer || playerData);
      
      // Also update game state with player data if needed
      gameDispatch({ 
        type: 'SET_PLAYER_DATA', 
        payload: createdPlayer || playerData 
      });
      
      // CRITICAL FIX: Clear the loading state before showing journey loading
      gameDispatch({ type: 'SET_LOADING', payload: false });
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Show loading spinner
      setShowJourneyLoading(true);
      console.log('showJourneyLoading set to true at:', new Date().toISOString());
      
      // Set new timeout for transition to video
      loadingTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          console.log('5 seconds elapsed, transitioning to video at:', new Date().toISOString());
          console.log('Current showJourneyLoading before update:', showJourneyLoading);
          
          // Use functional updates to ensure we're using the latest state
          setShowJourneyLoading(false);
          setShowLaunchVideo(true);
          
          console.log('After state updates: showJourneyLoading=false, showLaunchVideo=true');
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error during launch:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to create player profile. ';
      
      if (error.message.includes('please try again')) {
        errorMessage = error.message;
      } else if (error.message.includes('quota')) {
        errorMessage = 'Browser storage is full. Please clear some space and refresh.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Unable to access storage. Please check your browser permissions.';
      } else {
        errorMessage += 'Please try again or refresh the page.';
      }
      
      gameDispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage
      });
      
      // Clear loading state
      gameDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleVideoComplete = () => {
    console.log('Video complete, going to mission map');
    setShowLaunchVideo(false);
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
    audioActions.playSoundEffect('gameStart');
    audioActions.playVoiceover('welcome');
  };

  // FIXED: Use useCallback to memoize the function
  const handleGameComplete = useCallback((gameName, scoreData) => {
    console.log(`Game ${gameName} completed with score:`, scoreData);
    
    // First, update the progress in the state
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: gameName, progress: scoreData }
    });

    // Save to player progress
    playerActions.updatePlayerProgress(gameName, scoreData);

    // IMPORTANT: We need to check the NEW state after update
    // Since state updates are async, we'll simulate what the new state would be
    const updatedProgress = {
      ...gameState.gameProgress,
      [gameName]: {
        ...gameState.gameProgress[gameName],
        ...scoreData
      }
    };

    // Check if all games are completed with the updated progress
    const allGamesCompleted = Object.values(updatedProgress).every(
      game => game.completed === true
    );

    console.log('Game completed:', gameName);
    console.log('All games completed check:', allGamesCompleted);
    console.log('Current progress:', updatedProgress);

    if (allGamesCompleted) {
      console.log('All games completed! Showing end credits.');
      gameDispatch({ type: 'SET_VIEW', payload: 'end-credits' });
      audioActions.playSoundEffect('success');
    } else {
      console.log('Not all games completed. Returning to mission map.');
      gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
    }
  }, [gameDispatch, playerActions, gameState.gameProgress, audioActions]);

  // FIXED: Auto-navigation to end-credits only if NOT initial page load
  useEffect(() => {
    // DON'T auto-navigate on initial page load/refresh
    if (gameState.isInitialLoad) {
      console.log('🔄 Initial page load - skipping auto-navigation to end-credits');
      return;
    }

    // Check if all games are completed whenever gameProgress changes
    const allGamesCompleted = Object.values(gameState.gameProgress).every(
      game => game.completed === true
    );

    // Only trigger if we're not already on end-credits and all games are completed
    if (allGamesCompleted && gameState.currentView !== 'end-credits') {
      console.log('All games completed via useEffect!');
      gameDispatch({ type: 'SET_VIEW', payload: 'end-credits' });
      audioActions.playSoundEffect('success');
    }
  }, [gameState.gameProgress, gameState.currentView, gameState.isInitialLoad, gameDispatch, audioActions]);

  const renderCurrentView = () => {
    // Debug: Log what's being rendered
    console.log('Rendering view:', {
      showJourneyLoading,
      showLaunchVideo,
      currentView: gameState.currentView,
      isDataLoaded: gameState.isDataLoaded
    });

    if (showJourneyLoading) {
      return <LoadingSpinner message="Launching rocket" />;
    }

    if (showLaunchVideo) {
      return <LaunchVideo onSkip={handleVideoComplete} />;
    }

    // Only show RocketLoader if we're in loading view
    if (gameState.currentView === 'loading') {
      // If data isn't loaded yet, show a simple loading message
      if (!gameState.isDataLoaded) {
        return <LoadingSpinner message="Loading game data..." />;
      }
      return <RocketLoader onComplete={handleLoadingComplete} duration={2000} />;
    }
    
    switch (gameState.currentView) {
      case 'launch':
        return <LaunchScreen onLaunch={handleLaunch} />;
      
      case 'mission-map':
        return <MissionMap />;
      
      case 'data-export':
        return <DataExport />;
      
      case 'game1':
        return <Game1Root onComplete={(score) => handleGameComplete('game1', score)} />;
      
      case 'game2':
        return <Game2Root onComplete={(score) => handleGameComplete('game2', score)} />;
      
      case 'game3':
        return <Game3Root onComplete={(score) => handleGameComplete('game3', score)} />;
      
      case 'end-credits':
        return <EndCredits />;
      
      default:
        console.log('No matching view, defaulting to launch');
        return <LaunchScreen onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="astrovoyager-app">
      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: '#0ff',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 9999,
          fontFamily: 'monospace',
          border: '1px solid #00ffff',
          boxShadow: '0 0 10px rgba(0,255,255,0.3)'
        }}>
          <div>View: <strong style={{color: '#fff'}}>{gameState.currentView}</strong></div>
          <div>Initial: <strong style={{color: gameState.isInitialLoad ? '#ff0' : '#0f0'}}>{gameState.isInitialLoad ? 'Yes' : 'No'}</strong></div>
          <div>Data Loaded: <strong style={{color: gameState.isDataLoaded ? '#0f0' : '#f00'}}>{gameState.isDataLoaded ? 'Yes' : 'No'}</strong></div>
          <div>Loading: <strong style={{color: showJourneyLoading ? '#ff0' : '#888'}}>{showJourneyLoading ? 'Yes' : 'No'}</strong></div>
          <div>Video: <strong style={{color: showLaunchVideo ? '#0f0' : '#888'}}>{showLaunchVideo ? 'Yes' : 'No'}</strong></div>
          <div>isLoading: <strong style={{color: gameState.isLoading ? '#f00' : '#0f0'}}>{gameState.isLoading ? 'Yes' : 'No'}</strong></div>
        </div>
      )} */}
      
      {gameState.currentView !== 'loading' && !showLaunchVideo && !showJourneyLoading && <AudioControls />}
      
      {/* Only show global loading spinner if not in journey loading */}
      {gameState.isLoading && !showJourneyLoading && !showLaunchVideo && (
        <LoadingSpinner message="Preparing mission..." />
      )}
      
      {gameState.error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{gameState.error}</span>
          </div>
          <button 
            onClick={() => gameDispatch({ type: 'CLEAR_ERROR' })}
            className="error-close"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="app-content">
        {renderCurrentView()}
      </div>
    </div>
  );
}

function App() {
  return (
    <GameStateProvider>
      <AudioProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </AudioProvider>
    </GameStateProvider>
  );
}

export default App;