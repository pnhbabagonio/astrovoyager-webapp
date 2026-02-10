// components/admin/DataExport.js
import React, { useState, useEffect } from 'react';
import { IndexedDBService } from '../../services/storage';
import { useGameState } from '../../contexts/GameStateContext';
import { useAudio } from  '../../contexts/AudioContext';
import './DataExport.css';

const DataExport = () => {
  const { dispatch } = useGameState();
  const { actions: audioActions } = useAudio();
  const [statistics, setStatistics] = useState(null);
  const [players, setPlayers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [importFile, setImportFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stats, allPlayers, allProgress] = await Promise.all([
        IndexedDBService.getStatistics(),
        IndexedDBService.getAllPlayers(),
        IndexedDBService.getAllGameProgress()
      ]);
      
      setStatistics(stats);
      setPlayers(allPlayers);
      setProgress(allProgress);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      if (exportFormat === 'json') {
        await IndexedDBService.exportToFile();
        setMessage('Data exported as JSON file');
      } else if (exportFormat === 'csv') {
        await IndexedDBService.exportToCSV();
        setMessage('Data exported as CSV file');
      }
    } catch (error) {
      console.error('Export error:', error);
      setMessage('Export failed');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setMessage('Please select a file first');
      return;
    }

    if (!window.confirm('This will replace all existing data. Continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      await IndexedDBService.importFromFile(importFile);
      await loadData();
      setMessage('Data imported successfully');
      setImportFile(null);
    } catch (error) {
      console.error('Import error:', error);
      setMessage('Import failed - check file format');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('WARNING: This will delete ALL player data. Are you sure?')) {
      return;
    }

    try {
      await IndexedDBService.clearAllData();
      await loadData();
      setMessage('All data cleared');
    } catch (error) {
      console.error('Clear error:', error);
      setMessage('Failed to clear data');
    }
  };

  const handleBackToMap = () => {
    audioActions.playSoundEffect?.('buttonClick');
    dispatch({ type: 'SET_VIEW', payload: 'mission-map' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="data-export-container">
      {/* Back Button Header */}
      <div className="admin-header">

        
        <div className="admin-title">
          <h1>🌌 AstroVoyager Data Management</h1>
          <p className="subtitle">View and export player data</p>
        </div>
      </div>

      {message && (
        <div className="message-banner">
          {message}
          <button onClick={() => setMessage('')} className="close-btn">×</button>
        </div>
      )}

      {/* Statistics Panel */}
      <div className="stats-panel">
        <h2>📊 Game Statistics</h2>
        {statistics ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statistics.totalPlayers}</div>
              <div className="stat-label">Total Players</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.totalGamesPlayed}</div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.completedGames}</div>
              <div className="stat-label">Completed Games</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {statistics.averageScoreGame1.toFixed(1)}
              </div>
              <div className="stat-label">Avg Game 1 Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {statistics.averageScoreGame2.toFixed(1)}
              </div>
              <div className="stat-label">Avg Game 2 Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {statistics.averageScoreGame3.toFixed(1)}
              </div>
              <div className="stat-label">Avg Game 3 Score</div>
            </div>
          </div>
        ) : (
          <p>Loading statistics...</p>
        )}
      </div>

      {/* Export/Import Controls */}
      <div className="controls-panel">
        <div className="export-controls">
          <h3>Export Data</h3>
          <div className="format-selector">
            <label>
              <input
                type="radio"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              JSON (Full Data)
            </label>
            <label>
              <input
                type="radio"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              CSV (Excel Friendly)
            </label>
          </div>
          <button 
            onClick={handleExport} 
            disabled={isLoading}
            className="export-btn"
          >
            {isLoading ? 'Exporting...' : '📥 Download Export'}
          </button>
        </div>

        <div className="import-controls">
          <h3>Import Data</h3>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setImportFile(e.target.files[0])}
            className="file-input"
          />
          <button 
            onClick={handleImport}
            disabled={!importFile || isLoading}
            className="import-btn"
          >
            {isLoading ? 'Importing...' : '📤 Import Data'}
          </button>
        </div>

        <div className="danger-zone">
          <h3>⚠️ Danger Zone</h3>
          <button 
            onClick={handleClearData}
            className="clear-btn"
          >
            🗑️ Clear All Data
          </button>
          <p className="warning-text">This cannot be undone!</p>
        </div>
      </div>

      {/* Players Table */}
      <div className="data-table-container">
        <h2>👥 Player Records</h2>
        {players.length === 0 ? (
          <p>No player data found</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Encoded Name</th>
                  <th>Created</th>
                  <th>Last Played</th>
                  <th>Session ID</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id}>
                    <td>{player.id}</td>
                    <td>{player.name}</td>
                    <td>{player.encodedName}</td>
                    <td>{formatDate(player.createdAt)}</td>
                    <td>{formatDate(player.lastPlayed)}</td>
                    <td className="session-id">{player.sessionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Game Progress Table */}
      <div className="data-table-container">
        <h2>🎮 Game Progress Records</h2>
        {progress.length === 0 ? (
          <p>No game progress data found</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Player ID</th>
                  <th>Game</th>
                  <th>Completed</th>
                  <th>Score</th>
                  <th>Max Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {progress.map(record => (
                  <tr key={record.id} className={record.completed ? 'completed' : 'incomplete'}>
                    <td>{record.id}</td>
                    <td>{record.playerId}</td>
                    <td className="game-name">{record.gameName}</td>
                    <td>
                      <span className={`status-badge ${record.completed ? 'completed' : 'pending'}`}>
                        {record.completed ? '✅' : '⏳'}
                      </span>
                    </td>
                    <td className="score">{record.score}</td>
                    <td>{record.maxScore || 'N/A'}</td>
                    <td>{record.completionDate ? formatDate(record.completionDate) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>📋 How to Use</h3>
        <ol>
          <li><strong>Export Data:</strong> Click "Download Export" to save all data as a JSON/CSV file</li>
          <li><strong>View Data:</strong> Open the downloaded file in any text editor or Excel</li>
          <li><strong>Backup:</strong> Regularly export data to keep backups</li>
          <li><strong>Import:</strong> Use JSON exports to restore data (replaces existing data)</li>
        </ol>
        <p className="note">Note: Data is stored in browser's IndexedDB. Export regularly to prevent data loss.</p>
        
        <div className="quick-actions">
          <button onClick={handleBackToMap} className="quick-back-btn">
            🚀 Return to Mission Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExport;