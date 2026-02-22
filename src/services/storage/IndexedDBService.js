// services/storage/IndexedDBService.js
import { openDB } from 'idb';

class IndexedDBService {
  constructor() {
    this.dbName = 'astrovoyager_db';
    this.version = 1;
    this.db = null;
  }

  async init() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('players')) {
          const playerStore = db.createObjectStore('players', { keyPath: 'id', autoIncrement: true });
          playerStore.createIndex('sessionId', 'sessionId', { unique: true });
          playerStore.createIndex('name', 'name');
        }
        
        if (!db.objectStoreNames.contains('gameProgress')) {
          const progressStore = db.createObjectStore('gameProgress', { keyPath: 'id' });
          progressStore.createIndex('playerId', 'playerId');
          progressStore.createIndex('gameName', 'gameName');
          progressStore.createIndex('completionDate', 'completionDate');
        }
        
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
    return db.put('players', playerData);
  }

  async getPlayer(sessionId) {
    const db = await this.getDB();
    return db.getFromIndex('players', 'sessionId', sessionId);
  }

  async getAllPlayers() {
    const db = await this.getDB();
    return db.getAll('players');
  }

  // Game progress operations
  async saveGameProgress(progressData) {
    const db = await this.getDB();
    return db.put('gameProgress', progressData);
  }

  async getGameProgress(playerId, gameName = null) {
    const db = await this.getDB();
    if (gameName) {
      return db.getAllFromIndex('gameProgress', 'gameName', gameName);
    }
    return db.getAllFromIndex('gameProgress', 'playerId', playerId);
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

  // NEW: Enhanced Export/Import with file download
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
    
    // Create and download JSON file
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
    
    // Convert players to CSV
    let csvContent = "PLAYER DATA\n";
    csvContent += "ID,Name,Encoded Name,Created At,Last Played,Session ID\n";
    
    data.players.forEach(player => {
      csvContent += `${player.id},"${player.name}","${player.encodedName}",${player.createdAt},${player.lastPlayed},${player.sessionId}\n`;
    });
    
    csvContent += "\n\nGAME PROGRESS DATA\n";
    csvContent += "ID,Player ID,Game Name,Completed,Score,Max Score,Completion Date\n";
    
    data.progress.forEach(progress => {
      csvContent += `${progress.id},${progress.playerId},${progress.gameName},${progress.completed},${progress.score},${progress.maxScore},${progress.completionDate}\n`;
    });
    
    // Download CSV
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
    
    if (data.players) {
      for (const player of data.players) {
        await tx.objectStore('players').put(player);
      }
    }
    
    if (data.progress) {
      for (const progress of data.progress) {
        await tx.objectStore('gameProgress').put(progress);
      }
    }
    
    if (data.settings) {
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
        game1Scores.reduce((sum, p) => sum + p.score, 0) / game1Scores.length : 0,
      averageScoreGame2: game2Scores.length > 0 ? 
        game2Scores.reduce((sum, p) => sum + p.score, 0) / game2Scores.length : 0,
      averageScoreGame3: game3Scores.length > 0 ? 
        game3Scores.reduce((sum, p) => sum + p.score, 0) / game3Scores.length : 0,
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