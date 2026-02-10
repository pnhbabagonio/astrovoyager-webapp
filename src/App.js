import React, { useEffect, useState, useCallback } from 'react';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import RocketLoader from './components/common/RocketLoader/RocketLoader';
import LaunchScreen from './components/screens/LaunchScreen/LaunchScreen';
import MissionMap from './components/screens/MissionMap/MissionMap';
import Game1_Root from './components/games/Game1_EnergyDetectives/Game1_Root';
import Game2_Root from './components/games/Game2_TiltQuest/Game2_Root';
import Game3_Root from './components/games/Game3_SeasonNavigator/Game3_Root';
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
  const [isAppReady, setIsAppReady] = useState(false);
  const [showLaunchVideo, setShowLaunchVideo] = useState(false);
  const [showJourneyLoading, setShowJourneyLoading] = useState(false);
  const [playerData, setPlayerData] = useState(null);

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
      gameDispatch({ type: 'RESET_GAME' });
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
          game1: { completed: true, score: 950, resiliencePoints: 500 },
          game2: { completed: true, score: 900, preparednessPoints: 450 },
          game3: { completed: true, score: 920, accuracyPoints: 480 }
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
        gameDispatch({ type: 'SET_INITIAL_LOAD_COMPLETE' });

        // Go to end credits
        gameDispatch({ type: 'SET_VIEW', payload: 'end-credits' });
        audioActions.playSoundEffect('success');
        
        // Show dev notification
        alert('DEV: Jumped to end credits!');
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
        gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
      }
      
      // Ctrl+Shift+L to go to launch screen
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        console.log('🎮 DEV: Going to launch screen');
        gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameDispatch, playerActions, audioActions]);

  // Wait for GameStateProvider to be fully initialized
  useEffect(() => {
    if (gameState.currentView !== 'loading' && gameState.isDataLoaded) {
      setIsAppReady(true);
    }
  }, [gameState.currentView, gameState.isDataLoaded]);

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
  }, [gameState.currentView, showLaunchVideo, showJourneyLoading, gameState.audioEnabled]);

  const handleLoadingComplete = () => {
    gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  const handleLaunch = async (playerName) => {
    gameDispatch({ type: 'SET_LOADING', payload: true });
    audioActions.playSoundEffect('rocketLaunch');
    
    try {
      const playerData = {
        name: playerName,
        encodedName: `Astronaut ${playerName}`,
        sessionId: `session_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      await playerActions.createPlayer(playerData);
      
      setPlayerData(playerData);
      setShowJourneyLoading(true);
      
      setTimeout(() => {
        setShowJourneyLoading(false);
        setShowLaunchVideo(true);
      }, 5000);
      
    } catch (error) {
      console.error('Error during launch:', error);
      gameDispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to create player profile. Please try again.' 
      });
    } finally {
      gameDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleVideoComplete = () => {
    setShowLaunchVideo(false);
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
    audioActions.playSoundEffect('gameStart');
    audioActions.playVoiceover('welcome');
  };

  // FIXED: Use useCallback to memoize the function
  const handleGameComplete = useCallback((gameName, scoreData) => {
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
    if (showJourneyLoading) {
      return <LoadingSpinner message="Launching rocket" />;
    }

    if (showLaunchVideo) {
      return <LaunchVideo onSkip={handleVideoComplete} />;
    }

    if (gameState.currentView === 'loading') {
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
        return <Game1_Root onComplete={(score) => handleGameComplete('game1', score)} />;
      
      case 'game2':
        return <Game2_Root onComplete={(score) => handleGameComplete('game2', score)} />;
      
      case 'game3':
        return <Game3_Root onComplete={(score) => handleGameComplete('game3', score)} />;
      
      case 'end-credits':
        return <EndCredits />;
      
      default:
        return <LaunchScreen onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="astrovoyager-app">
      {/* Development shortcut hint - visible in development only */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="dev-hint" style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#0f0',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          Dev: Ctrl+Shift+E for End Credits
        </div>
      )} */}
      
      {gameState.currentView !== 'loading' && !showLaunchVideo && !showJourneyLoading && <AudioControls />}
      
      {gameState.isLoading && (
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