
import type { LogEntry } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface LogItemProps {
  log: LogEntry;
}

export function LogItem({ log }: LogItemProps) {
  const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });

  const levelClasses = {
    info: 'border-blue-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    success: 'border-green-500',
    action: 'border-purple-500',
    debug: 'border-gray-500',
  };

  return (
    <Card className={cn("mb-2 shadow-sm border-l-4", levelClasses[log.level] || 'border-gray-300')}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{log.emoji}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{log.message}</p>
              <p className="text-xs text-muted-foreground font-code">
                {log.source === 'server' ? 'SERVER' : 'CLIENT'} - {new Date(log.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
        </div>
        {log.details && (
          <pre className="mt-2 p-2 bg-muted/50 rounded-md text-xs font-code overflow-x-auto">
            {JSON.stringify(log.details, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
