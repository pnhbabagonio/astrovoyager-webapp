// contexts/PlayerContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import indexedDBService from '../services/storage/IndexedDBService';

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
  isLoaded: false,
  error: null
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_PLAYER':
      return {
        ...state,
        currentPlayer: action.payload,
        error: null
      };
    
    case 'ADD_PLAYER':
      const updatedPlayers = [...state.players, action.payload];
      return {
        ...state,
        players: updatedPlayers,
        currentPlayer: action.payload,
        error: null
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
        isLoaded: true,
        error: null
      };
    
    case 'UPDATE_STATISTICS':
      return {
        ...state,
        statistics: {
          ...state.statistics,
          ...action.payload
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
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

  // Initialize IndexedDB and load players on mount
  useEffect(() => {
    const initDBAndLoadPlayers = async () => {
      try {
        console.log('Initializing IndexedDB...');
        await indexedDBService.init();
        console.log('IndexedDB initialized successfully');
        
        // Load all players
        const players = await indexedDBService.getAllPlayers();
        console.log('Loaded players:', players);
        dispatch({ type: 'LOAD_PLAYERS', payload: players });
        
        // Set the most recent player as current if exists
        if (players.length > 0) {
          const sortedPlayers = [...players].sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          const latestPlayer = sortedPlayers[0];
          console.log('Setting current player to:', latestPlayer);
          dispatch({ type: 'SET_CURRENT_PLAYER', payload: latestPlayer });
          
          // Load progress for current player
          try {
            const progress = await indexedDBService.getGameProgress(latestPlayer.id);
            console.log('Loaded progress for player:', progress);
            
            // Convert progress array to object keyed by game name
            const progressObj = {};
            progress.forEach(item => {
              progressObj[item.gameName] = item;
            });
            
            // Update progress in state
            Object.entries(progressObj).forEach(([gameName, gameData]) => {
              dispatch({
                type: 'UPDATE_PLAYER_PROGRESS',
                payload: { game: gameName, data: gameData }
              });
            });
          } catch (progressError) {
            console.error('Error loading player progress:', progressError);
          }
        }
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize database' });
        dispatch({ type: 'LOAD_PLAYERS', payload: [] });
      }
    };

    initDBAndLoadPlayers();
  }, []);

  const createPlayer = useCallback(async (playerData) => {
    try {
      console.log('Creating player with data:', playerData);
      
      // Validate player data
      if (!playerData.name || !playerData.name.trim()) {
        throw new Error('Player name is required');
      }

      // Prepare player data for saving (let IndexedDB generate the ID)
      const playerToSave = {
        name: playerData.name.trim(),
        encodedName: playerData.encodedName || `Astronaut ${playerData.name.trim()}`,
        sessionId: playerData.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: playerData.createdAt || new Date().toISOString(),
        lastPlayed: playerData.lastPlayed || new Date().toISOString()
      };

      console.log('Saving player to IndexedDB:', playerToSave);
      
      // Save to IndexedDB
      const savedPlayer = await indexedDBService.savePlayer(playerToSave);
      console.log('Player saved successfully:', savedPlayer);
      
      // Update local state
      dispatch({ type: 'ADD_PLAYER', payload: savedPlayer });
      
      return savedPlayer;
    } catch (error) {
      console.error('Error creating player:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updatePlayerProgress = useCallback(async (gameName, progressData) => {
    if (!state.currentPlayer) {
      console.error('No current player found when saving progress');
      throw new Error('No player selected');
    }

    const now = new Date().toISOString();
    
    try {
      // Create progress record (let IndexedDB generate the ID)
      const progressRecord = {
        playerId: state.currentPlayer.id,
        gameName,
        completed: progressData.completed || false,
        score: progressData.score || 0,
        maxScore: progressData.maxScore || 0,
        completionDate: progressData.completionDate || (progressData.completed ? now : null),
        updatedAt: now,
        // Include any game-specific data
        ...progressData
      };

      console.log('Saving game progress:', progressRecord);
      
      // Save to IndexedDB
      const savedProgress = await indexedDBService.saveGameProgress(progressRecord);
      console.log('Game progress saved successfully:', savedProgress);
      
      // Update local state
      dispatch({
        type: 'UPDATE_PLAYER_PROGRESS',
        payload: { game: gameName, data: progressRecord }
      });
      
      // Update player's lastPlayed timestamp
      const updatedPlayer = {
        ...state.currentPlayer,
        lastPlayed: now
      };
      
      const savedPlayer = await indexedDBService.savePlayer(updatedPlayer);
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: savedPlayer });
      
      return savedProgress;
    } catch (error) {
      console.error('Error saving progress to IndexedDB:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.currentPlayer]);

  const switchPlayer = useCallback(async (playerId) => {
    try {
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
        
        // Load progress for the switched player
        const progress = await indexedDBService.getGameProgress(playerId);
        
        // Clear existing progress and load new
        const progressObj = {};
        progress.forEach(item => {
          progressObj[item.gameName] = item;
          dispatch({
            type: 'UPDATE_PLAYER_PROGRESS',
            payload: { game: item.gameName, data: item }
          });
        });
      }
    } catch (error) {
      console.error('Error switching player:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.players]);

  const getPlayerProgress = useCallback(async (gameName = null) => {
    if (!state.currentPlayer) return null;
    
    try {
      if (gameName) {
        const progress = await indexedDBService.getGameProgress(state.currentPlayer.id, gameName);
        return progress[0] || null;
      }
      
      return await indexedDBService.getGameProgress(state.currentPlayer.id);
    } catch (error) {
      console.error('Error getting player progress:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, [state.currentPlayer]);

  const refreshPlayers = useCallback(async () => {
    try {
      const players = await indexedDBService.getAllPlayers();
      dispatch({ type: 'LOAD_PLAYERS', payload: players });
    } catch (error) {
      console.error('Error refreshing players:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const value = {
    state,
    actions: {
      createPlayer,
      updatePlayerProgress,
      switchPlayer,
      getPlayerProgress,
      refreshPlayers
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