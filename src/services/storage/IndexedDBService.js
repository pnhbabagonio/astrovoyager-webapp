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
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('players')) {
          const playerStore = db.createObjectStore('players', { keyPath: 'id', autoIncrement: true });
          playerStore.createIndex('sessionId', 'sessionId', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('gameProgress')) {
          const progressStore = db.createObjectStore('gameProgress', { keyPath: 'id' });
          progressStore.createIndex('playerId', 'playerId');
          progressStore.createIndex('gameName', 'gameName');
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

  // Settings operations
  async saveSettings(settings) {
    const db = await this.getDB();
    return db.put('settings', settings);
  }

  async getSettings() {
    const db = await this.getDB();
    return db.get('settings', 'app-settings');
  }

  // Export/Import data
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
      version: this.version
    };
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

  // Clear all data (for testing/reset)
  async clearAllData() {
    const db = await this.getDB();
    const tx = db.transaction(['players', 'gameProgress', 'settings'], 'readwrite');
    
    await tx.objectStore('players').clear();
    await tx.objectStore('gameProgress').clear();
    await tx.objectStore('settings').clear();
    
    await tx.done;
  }
}

export default new IndexedDBService();