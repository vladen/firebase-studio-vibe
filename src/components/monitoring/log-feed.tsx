
"use client";

import { useState, useEffect, useRef } from 'react';
import type { LogEntry } from '@/lib/types';
import { LogItem } from './log-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, RefreshCw } from 'lucide-react';
import { addClientLog, getClientLogs, subscribeToClientLogs } from '@/lib/logger';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_DISPLAY_LOGS = 100;

export function LogFeed() {
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastLogRef = useRef<HTMLDivElement>(null);

  const fetchServerLogs = async () => {
    try {
      setError(null);
      const response = await fetch('/api/logs');
      if (!response.ok) {
        throw new Error(`Failed to fetch server logs: ${response.statusText}`);
      }
      const serverLogsData = await response.json();
      // Ensure server logs are properly typed and merge
      const typedServerLogs = serverLogsData.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })) as LogEntry[];
      
      setAllLogs(prevLogs => {
        const clientOnlyLogs = prevLogs.filter(log => log.source === 'client');
        const combined = [...typedServerLogs, ...clientOnlyLogs];
        combined.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return combined.slice(-MAX_DISPLAY_LOGS);
      });

    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      addClientLog(`Error fetching server logs: ${errorMessage}`, 'error');
    }
  };


  useEffect(() => {
    const initializeLogs = async () => {
      setIsLoading(true);
      // Get initial client logs
      const initialClientLogs = getClientLogs();
      setAllLogs(initialClientLogs);
      
      // Fetch initial server logs
      await fetchServerLogs();
      setIsLoading(false);
    };

    initializeLogs();

    // Subscribe to new client logs
    const unsubscribeClient = subscribeToClientLogs((newLog) => {
      if (!isPaused) {
        setAllLogs(prevLogs => {
            const updatedLogs = [...prevLogs, newLog];
            updatedLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return updatedLogs.slice(-MAX_DISPLAY_LOGS);
        });
      }
    });
    
    // Poll for server logs
    const intervalId = setInterval(async () => {
      if (!isPaused) {
        await fetchServerLogs();
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      unsubscribeClient();
      clearInterval(intervalId);
    };
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused && lastLogRef.current) {
      lastLogRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allLogs, isPaused]);

  const handleClearLogs = () => {
    setAllLogs([]);
    addClientLog('Logs cleared by user.', 'action');
    // Note: This only clears client-side display. Server logs persist in memory until server restart / max log limit.
  };

  const handleRefreshLogs = async () => {
    setIsLoading(true);
    addClientLog('Manually refreshing logs.', 'action');
    await fetchServerLogs(); // Re-fetch server logs
    const currentClientLogs = getClientLogs(); // Re-fetch client logs
    setAllLogs(prevServerLogs => {
      const serverOnlyLogs = prevServerLogs.filter(log => log.source === 'server');
      const combined = [...serverOnlyLogs, ...currentClientLogs];
      combined.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return combined.slice(-MAX_DISPLAY_LOGS);
    });
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-card p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Real-time Activity Feed</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshLogs} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearLogs}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 text-destructive border border-destructive rounded-md text-sm">
          Error fetching logs: {error}
        </div>
      )}
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-3">
        {isLoading && allLogs.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-2 p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 mr-2 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : allLogs.length === 0 && !isLoading ? (
           <div className="text-center text-muted-foreground py-10">No logs to display.</div>
        ) : (
          allLogs.map((log, index) => (
            <div key={log.id} ref={index === allLogs.length - 1 ? lastLogRef : null}>
              <LogItem log={log} />
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
