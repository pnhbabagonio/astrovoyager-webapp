import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { IndexedDBService } from '../services/storage';

const PlayerContext = createContext();

const initialState = {
  currentPlayer: null,
  players: [],
  progress: {},
  statistics: {
    totalPlayTime: 0,
    gamesCompleted: 0,
    totalPoints: 0,
    sessions: 0
  },
  isLoaded: false // Track if players are loaded
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_PLAYER':
      return {
        ...state,
        currentPlayer: action.payload
      };
    
    case 'ADD_PLAYER':
      const updatedPlayers = [...state.players, action.payload];
      return {
        ...state,
        players: updatedPlayers,
        currentPlayer: action.payload
      };
    
    case 'UPDATE_PLAYER_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.game]: {
            ...state.progress[action.payload.game],
            ...action.payload.data
          }
        }
      };
    
    case 'LOAD_PLAYERS':
      return {
        ...state,
        players: action.payload,
        isLoaded: true
      };
    
    case 'UPDATE_STATISTICS':
      return {
        ...state,
        statistics: {
          ...state.statistics,
          ...action.payload
        }
      };
    
    case 'RESET_PLAYER':
      return {
        ...initialState,
        players: state.players,
        isLoaded: true
      };
    
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Load players from IndexedDB on mount - NON-BLOCKING
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await IndexedDBService.getAllPlayers();
        dispatch({ type: 'LOAD_PLAYERS', payload: players });
      } catch (error) {
        console.log('Error loading players:', error);
        // Mark as loaded even if there's an error
        dispatch({ type: 'LOAD_PLAYERS', payload: [] });
      }
    };

    loadPlayers();
  }, []);

  const createPlayer = async (playerData) => {
    try {
      const playerWithId = {
        ...playerData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      await IndexedDBService.savePlayer(playerWithId);
      dispatch({ type: 'ADD_PLAYER', payload: playerWithId });
      
      return playerWithId;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  };

  const updatePlayerProgress = async (gameName, progressData) => {
    if (!state.currentPlayer) return;

    const progressRecord = {
      id: `${state.currentPlayer.id}_${gameName}`,
      playerId: state.currentPlayer.id,
      gameName,
      ...progressData,
      updatedAt: new Date().toISOString()
    };

    try {
      await IndexedDBService.saveGameProgress(progressRecord);
      dispatch({
        type: 'UPDATE_PLAYER_PROGRESS',
        payload: { game: gameName, data: progressData }
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const switchPlayer = (playerId) => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
    }
  };

  const getPlayerProgress = (gameName = null) => {
    if (!state.currentPlayer) return null;
    
    if (gameName) {
      return state.progress[gameName];
    }
    
    return state.progress;
  };

  const value = {
    state,
    actions: {
      createPlayer,
      updatePlayerProgress,
      switchPlayer,
      getPlayerProgress
    }
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}