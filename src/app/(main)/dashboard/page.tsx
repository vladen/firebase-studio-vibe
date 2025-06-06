
import { LogFeed } from '@/components/monitoring/log-feed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Users, Server } from 'lucide-react';

// Mock data for stats - replace with actual data fetching later
const mockStats = {
  totalLogs: 1253,
  errorsToday: 5,
  clientEvents: 870,
  serverEvents: 383,
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee your application&apos;s activity in real-time.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalLogs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.errorsToday}</div>
            <p className="text-xs text-muted-foreground text-destructive">-2 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.clientEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+150 in last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Events</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.serverEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+50 in last hour</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1 min-h-0"> {/* This ensures LogFeed takes remaining height */}
        <LogFeed />
      </div>
    </div>
  );
}
