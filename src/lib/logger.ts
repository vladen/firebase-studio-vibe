
import type { LogEntry, LogLevel } from './types';

const MAX_CLIENT_LOGS = 100;
const MAX_SERVER_LOGS = 200;

// Client-side logger
let clientLogs: LogEntry[] = [];
let clientLogListeners: Array<(log: LogEntry) => void> = [];

const getEmoji = (level: LogLevel): string => {
  switch (level) {
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'success': return '✅';
    case 'action': return '🚀';
    case 'debug': return '🔍';
    default: return '➡️';
  }
};

export const addClientLog = (message: string, level: LogLevel = 'info', details?: Record<string, any>): void => {
  const newLog: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    message,
    level,
    emoji: getEmoji(level),
    source: 'client',
    details,
  };
  clientLogs = [newLog, ...clientLogs].slice(0, MAX_CLIENT_LOGS);
  clientLogListeners.forEach(listener => listener(newLog));
};

export const getClientLogs = (): LogEntry[] => {
  return [...clientLogs].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const subscribeToClientLogs = (listener: (log: LogEntry) => void): (() => void) => {
  clientLogListeners.push(listener);
  return () => {
    clientLogListeners = clientLogListeners.filter(l => l !== listener);
  };
};

// Server-side in-memory log store (for API)
let serverLogs: LogEntry[] = [];

export const addServerLog = (message: string, level: LogLevel = 'info', details?: Record<string, any>): void => {
  const newLog: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    message,
    level,
    emoji: getEmoji(level),
    source: 'server',
    details,
  };
  serverLogs = [newLog, ...serverLogs].slice(0, MAX_SERVER_LOGS);
  console.log(`[Server Log - ${level.toUpperCase()}]: ${message}`, details || '');
};

export const getServerLogs = (): LogEntry[] => {
  return [...serverLogs].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Initialize with a few server logs for demo
addServerLog('Project Sentinel server initialized.', 'info');
addServerLog('Log monitoring service started.', 'success', { service: 'LoggerAPI' });

// Simulate some client activity logs
if (typeof window !== 'undefined') {
  addClientLog('Application loaded.', 'success');
  
  // Example: Log navigation changes (simplified)
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    addClientLog(`Navigated to ${window.location.pathname}`, 'action', { path: window.location.pathname });
  };
  window.addEventListener('popstate', () => {
    addClientLog(`Navigated back/forward to ${window.location.pathname}`, 'action', { path: window.location.pathname });
  });
}
