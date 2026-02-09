// GameStateContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { IndexedDBService } from '../services/storage';

const GameStateContext = createContext();

const initialState = {
  currentView: 'loading',
  playerData: null,
  gameProgress: {
    game1: { 
      completed: false, 
      score: 0,
      maxScore: 0,
      completionDate: null,
      character: null
    },
    game2: { 
      completed: false, 
      score: 0,
      maxScore: 0,
      completionDate: null,
      locationsCompleted: 0
    },
    game3: { 
      completed: false, 
      score: 0,
      maxScore: 0,
      completionDate: null,
      completedRegions: []
    }
  },
  audioEnabled: true,
  isLoading: false,
  error: null,
  isOnline: navigator.onLine,
  isDataLoaded: false
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

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const players = await IndexedDBService.getAllPlayers();
        const lastPlayer = players[players.length - 1];
        
        if (lastPlayer) {
          dispatch({ type: 'SET_PLAYER_DATA', payload: lastPlayer });
          
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
            });
        }
      } catch (error) {
        console.log('No saved data found:', error);
      } finally {
        dispatch({ type: 'SET_DATA_LOADED' });
      }
    };

    loadSavedData();
  }, []);

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