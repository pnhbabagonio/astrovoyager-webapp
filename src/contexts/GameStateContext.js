import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { IndexedDBService } from '../services/storage';

const GameStateContext = createContext();

const DEV_START_VIEW = 'game2';
// examples:
// 'mission-map'
// 'game1'
// 'game2'
// 'game3'


const initialState = {
  currentView: DEV_START_VIEW || 'loading',
  playerData: null,
  gameProgress: {
    game1: { completed: false, score: 0, resiliencePoints: 0 },
    game2: { completed: false, score: 0, preparednessPoints: 0 },
    game3: { completed: false, score: 0, accuracyPoints: 0 }
  },
  audioEnabled: true,
  isLoading: false,
  error: null,
  isOnline: navigator.onLine,
  isDataLoaded: false // New flag to track data loading
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_PLAYER_DATA':
      return { ...state, playerData: action.payload };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [action.payload.game]: {
            ...state.gameProgress[action.payload.game],
            ...action.payload.progress
          }
        }
      };
    
    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'SET_DATA_LOADED':
      return { ...state, isDataLoaded: true };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        currentView: 'launch',
        audioEnabled: state.audioEnabled,
        isDataLoaded: true
      };
    
    default:
      return state;
  }
}

export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved data on app start - NON-BLOCKING
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Don't await init here - it's already handled in App.js
        // Just try to load the data quickly
        
        // Try to load the last active player
        const players = await IndexedDBService.getAllPlayers();
        const lastPlayer = players[players.length - 1];
        
        if (lastPlayer) {
          dispatch({ type: 'SET_PLAYER_DATA', payload: lastPlayer });
          
          // Load progress for this player - don't wait for this to complete
          IndexedDBService.getGameProgress(lastPlayer.id)
            .then(progress => {
              progress.forEach(item => {
                dispatch({
                  type: 'UPDATE_PROGRESS',
                  payload: { game: item.gameName, progress: item }
                });
              });
            })
            .catch(error => {
              console.log('Error loading progress:', error);
              // Continue anyway - progress will be empty
            });
        }
      } catch (error) {
        console.log('No saved data found or error loading data:', error);
        // Continue anyway - this is not critical
      } finally {
        // Mark data as loaded regardless of success/failure
        dispatch({ type: 'SET_DATA_LOADED' });
      }
    };

    // Start loading data but don't block the app
    loadSavedData();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}