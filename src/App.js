import React, { useEffect, useState } from 'react';
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

  // Wait for GameStateProvider to be fully initialized, but don't block transitions
  useEffect(() => {
    if (gameState.currentView !== 'loading' && gameState.isInitialized) {
      setIsAppReady(true);
    }
  }, [gameState.currentView, gameState.isInitialized]);

  // Simplified background music management
  useEffect(() => {
    if (!gameState.audioEnabled) return;

    // Stop music when video is showing or during journey loading
    if (showLaunchVideo || showJourneyLoading) {
      audioActions.stopBackgroundMusic();
      return;
    }

    // Play appropriate music based on current view
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
        audioActions.playBackgroundMusic('victory');
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
      
      // Store player data and show journey loading
      setPlayerData(playerData);
      setShowJourneyLoading(true);
      
      // After 5 seconds, show the video
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
    // After video completes, go to mission map
    setShowLaunchVideo(false);
    gameDispatch({ type: 'SET_VIEW', payload: 'mission-map' });
    audioActions.playSoundEffect('gameStart');
    audioActions.playVoiceover('welcome');
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
    // Show Journey Loading after clicking BEGIN JOURNEY
    if (showJourneyLoading) {
      return <LoadingSpinner message="Launching rocket" />;
    }

    // Show LaunchVideo component when triggered
    if (showLaunchVideo) {
      return <LaunchVideo onComplete={handleVideoComplete} />;
    }

    // Show RocketLoader during initial loading state
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
        return <LaunchScreen onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="astrovoyager-app">
      {/* Show AudioControls as soon as we're past the loading screen and not in video/journey loading */}
      {gameState.currentView !== 'loading' && !showLaunchVideo && !showJourneyLoading && <AudioControls />}
      
      {/* Loading Overlay for general app loading */}
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