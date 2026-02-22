// services/storage/IndexedDBService.js
import { openDB } from 'idb';

class IndexedDBService {
  constructor() {
    this.dbName = 'astrovoyager_db';
    this.version = 3; // Increment version to trigger upgrade
    this.db = null;
  }

  async init() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
        
        // Players store
        if (!db.objectStoreNames.contains('players')) {
          const playerStore = db.createObjectStore('players', { 
            keyPath: 'id', 
            autoIncrement: true
          });
          playerStore.createIndex('sessionId', 'sessionId', { unique: true });
          playerStore.createIndex('name', 'name');
          playerStore.createIndex('createdAt', 'createdAt');
        } else {
          // Ensure indexes exist in existing store
          const playerStore = transaction.objectStore('players');
          if (!playerStore.indexNames.contains('sessionId')) {
            playerStore.createIndex('sessionId', 'sessionId', { unique: true });
          }
          if (!playerStore.indexNames.contains('name')) {
            playerStore.createIndex('name', 'name');
          }
          if (!playerStore.indexNames.contains('createdAt')) {
            playerStore.createIndex('createdAt', 'createdAt');
          }
        }
        
        // Game progress store
        if (!db.objectStoreNames.contains('gameProgress')) {
          const progressStore = db.createObjectStore('gameProgress', { 
            keyPath: 'id', 
            autoIncrement: true
          });
          progressStore.createIndex('playerId', 'playerId');
          progressStore.createIndex('gameName', 'gameName');
          progressStore.createIndex('completionDate', 'completionDate');
          progressStore.createIndex('player_game', ['playerId', 'gameName'], { unique: false });
        } else {
          const progressStore = transaction.objectStore('gameProgress');
          if (!progressStore.indexNames.contains('playerId')) {
            progressStore.createIndex('playerId', 'playerId');
          }
          if (!progressStore.indexNames.contains('gameName')) {
            progressStore.createIndex('gameName', 'gameName');
          }
          if (!progressStore.indexNames.contains('player_game')) {
            progressStore.createIndex('player_game', ['playerId', 'gameName'], { unique: false });
          }
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
    return this.db;
  }

  async getDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // Player operations
  async savePlayer(playerData) {
    const db = await this.getDB();
    try {
      // Remove id if it's undefined/null to let autoIncrement work
      const dataToSave = { ...playerData };
      if (dataToSave.id === undefined || dataToSave.id === null) {
        delete dataToSave.id;
      }
      
      const id = await db.put('players', dataToSave);
      console.log('Player saved with ID:', id);
      
      // Return the complete saved player
      const savedPlayer = await db.get('players', id);
      return savedPlayer;
    } catch (error) {
      console.error('Error saving player:', error);
      throw error;
    }
  }

  async getPlayer(sessionId) {
    const db = await this.getDB();
    try {
      const index = db.transaction('players').store.index('sessionId');
      return await index.get(sessionId);
    } catch (error) {
      console.log('Player not found by sessionId:', sessionId);
      return null;
    }
  }

  async getPlayerById(id) {
    const db = await this.getDB();
    return db.get('players', id);
  }

  async getAllPlayers() {
    const db = await this.getDB();
    return db.getAll('players');
  }

  async getLatestPlayer() {
    const db = await this.getDB();
    const players = await db.getAll('players');
    return players.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0] || null;
  }

  // Game progress operations
  async saveGameProgress(progressData) {
    const db = await this.getDB();
    try {
      // Remove id if it's undefined/null to let autoIncrement work
      const dataToSave = { ...progressData };
      if (dataToSave.id === undefined || dataToSave.id === null) {
        delete dataToSave.id;
      }
      
      const id = await db.put('gameProgress', dataToSave);
      console.log('Game progress saved with ID:', id);
      
      // Return the complete saved progress
      const savedProgress = await db.get('gameProgress', id);
      return savedProgress;
    } catch (error) {
      console.error('Error saving game progress:', error);
      throw error;
    }
  }

  async getGameProgress(playerId, gameName = null) {
    const db = await this.getDB();
    try {
      if (gameName) {
        // Use composite index for more efficient query
        const index = db.transaction('gameProgress').store.index('player_game');
        const range = IDBKeyRange.only([playerId, gameName]);
        return await index.getAll(range);
      } else {
        const index = db.transaction('gameProgress').store.index('playerId');
        return await index.getAll(playerId);
      }
    } catch (error) {
      console.error('Error getting game progress:', error);
      return [];
    }
  }

  async getAllGameProgress() {
    const db = await this.getDB();
    return db.getAll('gameProgress');
  }

  // Settings operations
  async saveSettings(settings) {
    const db = await this.getDB();
    return db.put('settings', settings);
  }

  async getSettings() {
    const db = await this.getDB();
    return db.get('settings', 'app-settings');
  }

  // Export/Import operations
  async exportData() {
    const db = await this.getDB();
    const players = await db.getAll('players');
    const progress = await db.getAll('gameProgress');
    const settings = await db.getAll('settings');
    
    return {
      players,
      progress,
      settings,
      exportDate: new Date().toISOString(),
      version: this.version,
      totalPlayers: players.length,
      totalGamesPlayed: progress.length
    };
  }

  async exportToFile() {
    const data = await this.exportData();
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astrovoyager_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return data;
  }

  async exportToCSV() {
    const data = await this.exportData();
    
    let csvContent = "PLAYER DATA\n";
    csvContent += "ID,Name,Encoded Name,Created At,Last Played,Session ID\n";
    
    data.players.forEach(player => {
      csvContent += `${player.id},"${player.name}","${player.encodedName}",${player.createdAt},${player.lastPlayed},${player.sessionId}\n`;
    });
    
    csvContent += "\n\nGAME PROGRESS DATA\n";
    csvContent += "ID,Player ID,Game Name,Completed,Score,Max Score,Completion Date\n";
    
    data.progress.forEach(progress => {
      csvContent += `${progress.id},${progress.playerId},${progress.gameName},${progress.completed},${progress.score},${progress.maxScore},${progress.completionDate || ''}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astrovoyager_stats_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async importData(data) {
    const db = await this.getDB();
    const tx = db.transaction(['players', 'gameProgress', 'settings'], 'readwrite');
    
    if (data.players && Array.isArray(data.players)) {
      for (const player of data.players) {
        await tx.objectStore('players').put(player);
      }
    }
    
    if (data.progress && Array.isArray(data.progress)) {
      for (const progress of data.progress) {
        await tx.objectStore('gameProgress').put(progress);
      }
    }
    
    if (data.settings && Array.isArray(data.settings)) {
      for (const setting of data.settings) {
        await tx.objectStore('settings').put(setting);
      }
    }
    
    await tx.done;
  }

  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          await this.importData(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Statistics
  async getStatistics() {
    const players = await this.getAllPlayers();
    const progress = await this.getAllGameProgress();
    
    const completedGames = progress.filter(p => p.completed);
    const game1Scores = progress.filter(p => p.gameName === 'game1' && p.completed);
    const game2Scores = progress.filter(p => p.gameName === 'game2' && p.completed);
    const game3Scores = progress.filter(p => p.gameName === 'game3' && p.completed);
    
    return {
      totalPlayers: players.length,
      totalGamesPlayed: progress.length,
      completedGames: completedGames.length,
      averageScoreGame1: game1Scores.length > 0 ? 
        game1Scores.reduce((sum, p) => sum + (p.score || 0), 0) / game1Scores.length : 0,
      averageScoreGame2: game2Scores.length > 0 ? 
        game2Scores.reduce((sum, p) => sum + (p.score || 0), 0) / game2Scores.length : 0,
      averageScoreGame3: game3Scores.length > 0 ? 
        game3Scores.reduce((sum, p) => sum + (p.score || 0), 0) / game3Scores.length : 0,
      lastPlayer: players.length > 0 ? players[players.length - 1] : null
    };
  }

  // Clear all data
  async clearAllData() {
    const db = await this.getDB();
    const tx = db.transaction(['players', 'gameProgress', 'settings'], 'readwrite');
    
    await tx.objectStore('players').clear();
    await tx.objectStore('gameProgress').clear();
    await tx.objectStore('settings').clear();
    
    await tx.done;
  }
}

const indexedDBService = new IndexedDBService();
export default indexedDBService;