// Updated PlayerContext.js - Fix the import and method calls

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import indexedDBService from '../services/storage/IndexedDBService'; // Note: default import, not named import

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
  isLoaded: false
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

  // Initialize IndexedDB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        await indexedDBService.init();
        console.log('IndexedDB initialized successfully');
        
        // Load players after DB is initialized
        const players = await indexedDBService.getAllPlayers();
        dispatch({ type: 'LOAD_PLAYERS', payload: players });
        
        // Set the most recent player as current if exists
        if (players.length > 0) {
          dispatch({ type: 'SET_CURRENT_PLAYER', payload: players[players.length - 1] });
        }
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        dispatch({ type: 'LOAD_PLAYERS', payload: [] });
      }
    };

    initDB();
  }, []);

  const createPlayer = async (playerData) => {
    try {
      console.log('Creating player with data:', playerData);
      
      const playerWithId = {
        ...playerData,
        id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
      };

      console.log('Saving player to IndexedDB:', playerWithId);
      
      // Use savePlayer method (exists in your IndexedDBService)
      const savedPlayer = await indexedDBService.savePlayer(playerWithId);
      
      dispatch({ type: 'ADD_PLAYER', payload: savedPlayer });
      
      return savedPlayer;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  };

  const updatePlayerProgress = async (gameName, progressData) => {
    if (!state.currentPlayer) {
      console.error('No current player found when saving progress');
      return;
    }

    const now = new Date().toISOString();
    
    // Generate a consistent ID for the progress record
    const progressId = `${state.currentPlayer.id}_${gameName}`;
    
    const progressRecord = {
      id: progressId,
      playerId: state.currentPlayer.id,
      gameName,
      ...progressData,
      updatedAt: now,
      completionDate: progressData.completionDate || now
    };

    try {
      console.log('Saving game progress:', progressRecord);
      
      // Use saveGameProgress method
      await indexedDBService.saveGameProgress(progressRecord);
      
      // Update local state
      dispatch({
        type: 'UPDATE_PLAYER_PROGRESS',
        payload: { game: gameName, data: progressData }
      });
      
      // Update player's lastPlayed timestamp
      const updatedPlayer = {
        ...state.currentPlayer,
        lastPlayed: now
      };
      
      // Use savePlayer to update the player
      await indexedDBService.savePlayer(updatedPlayer);
      
      // Update current player in state
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: updatedPlayer });
      
      console.log('Game progress saved successfully for', gameName);
    } catch (error) {
      console.error('Error saving progress to IndexedDB:', error);
      throw error; // Re-throw to handle in the calling component
    }
  };

  const switchPlayer = (playerId) => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
    }
  };

  const getPlayerProgress = async (gameName = null) => {
    if (!state.currentPlayer) return null;
    
    try {
      if (gameName) {
        const progress = await indexedDBService.getGameProgress(state.currentPlayer.id, gameName);
        return progress[0] || null;
      }
      
      return await indexedDBService.getGameProgress(state.currentPlayer.id);
    } catch (error) {
      console.error('Error getting player progress:', error);
      return null;
    }
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