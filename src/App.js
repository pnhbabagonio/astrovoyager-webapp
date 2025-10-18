import React, { useEffect, useState } from 'react';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import RocketLoader from './components/common/RocketLoader/RocketLoader';
import LaunchScreen from './components/screens/LaunchScreen/LaunchScreen';
import MissionMap from './components/screens/MissionMap/MissionMap';
import Game1_Root from './components/games/Game1_IslandOfChange/Game1_Root';
import Game2_Root from './components/games/Game2_WeatherWatchers/Game2_Root';
import Game3_Root from './components/games/Game3_MatchTheSun/Game3_Root';
import EndCredits from './components/screens/EndCredits/EndCredits';
import AudioControls from './components/common/AudioControls/AudioControls';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';

import './styles/globals/reset.css';
import './styles/globals/variables.css';
import './styles/globals/animations.css';
import './App.css';

function AppContent() {
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const { actions: playerActions } = usePlayer();
  const [isAppReady, setIsAppReady] = useState(false);

  // Wait for GameStateProvider to be fully initialized, but don't block transitions
  useEffect(() => {
    if (gameState.currentView !== 'loading' && gameState.isInitialized) {
      setIsAppReady(true);
    }
  }, [gameState.currentView, gameState.isInitialized]);

  // Play appropriate background music based on current view
  useEffect(() => {
    // Allow audio to play even if app isn't fully ready, but only when not in loading view
    if (gameState.audioEnabled && gameState.currentView !== 'loading') {
      switch (gameState.currentView) {
        case 'launch':
        case 'mission-map':
          audioActions.playBackgroundMusic('space');
          break;
        case 'game1':
        case 'game2':
        case 'game3':
          audioActions.playBackgroundMusic('adventure');
          break;
        case 'end-credits':
          audioActions.playBackgroundMusic('victory');
          break;
        default:
          audioActions.playBackgroundMusic('space');
      }
    }
  }, [gameState.currentView, gameState.audioEnabled, audioActions]);

  const handleLoadingComplete = () => {
    // ✅ Allow transition even if app isn't fully initialized
    // This prevents the RocketLoader from getting stuck
    gameDispatch({ type: 'SET_VIEW', payload: 'launch' });
  };

  const handleLaunch = async (playerName) => {
    gameDispatch({ type: 'SET_LOADING', payload: true });
    audioActions.playSoundEffect('rocketLaunch');
    
    try {
      // Create player data
      const playerData = {
        name: playerName,
        encodedName: `Astronaut ${playerName}`,
        sessionId: `session_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      // Save player using PlayerContext (DB is initialized in GameStateContext)
      await playerActions.createPlayer(playerData);
      
      gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
      audioActions.playSoundEffect('gameStart');
      audioActions.playVoiceover('welcome');
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

  const handleGameComplete = (gameName, scoreData) => {
    // Update progress in both contexts
    gameDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { game: gameName, progress: scoreData }
    });

    playerActions.updatePlayerProgress(gameName, scoreData);

    // Check if all games are completed
    const allGamesCompleted = Object.values(gameState.gameProgress).every(
      game => game.completed
    );

    if (allGamesCompleted) {
      gameDispatch({ type: 'SET_VIEW', payload: 'end-credits' });
      audioActions.playSoundEffect('success');
    } else {
      gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
    }
  };

  const renderCurrentView = () => {
    // ✅ Simplified: Only show RocketLoader during initial loading state
    // Allow transitions to happen even if assets aren't fully loaded
    if (gameState.currentView === 'loading') {
      return <RocketLoader onComplete={handleLoadingComplete} duration={2000} />;
    }
    
    switch (gameState.currentView) {
      case 'launch':
        return <LaunchScreen onLaunch={handleLaunch} />;
      
      case 'mission-map':
        return <MissionMap />;
      
      case 'game1':
        return <Game1_Root onComplete={(score) => handleGameComplete('game1', score)} />;
      
      case 'game2':
        return <Game2_Root onComplete={(score) => handleGameComplete('game2', score)} />;
      
      case 'game3':
        return <Game3_Root onComplete={(score) => handleGameComplete('game3', score)} />;
      
      case 'end-credits':
        return <EndCredits />;
      
      default:
        // Fallback if currentView gets into an unknown state
        return <LaunchScreen onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="astrovoyager-app">
      {/* ✅ Show AudioControls as soon as we're past the loading screen */}
      {gameState.currentView !== 'loading' && <AudioControls />}
      
      {/* Loading Overlay */}
      {gameState.isLoading && (
        <LoadingSpinner message="Preparing mission..." />
      )}
      
      {/* Error Banner */}
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
      
      {/* Main Content */}
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