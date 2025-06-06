
import { NextResponse } from 'next/server';
import { getServerLogs, addServerLog } from '@/lib/logger';
import type { LogEntry } from '@/lib/types';

export async function GET() {
  try {
    const logs = getServerLogs();
    return NextResponse.json<LogEntry[]>(logs);
  } catch (error) {
    console.error("Error fetching server logs:", error);
    // Add a server log about the error itself, if possible, without creating a loop
    // addServerLog("Failed to fetch server logs via API", "error", { error: (error as Error).message });
    return NextResponse.json({ message: 'Error fetching logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, level, details } = body;

    if (!message || !level) {
      return NextResponse.json({ message: 'Missing message or level' }, { status: 400 });
    }

    addServerLog(message, level, details);
    return NextResponse.json({ message: 'Log added successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error adding server log via API:", error);
    // addServerLog("Failed to add server log via API", "error", { error: (error as Error).message });
    return NextResponse.json({ message: 'Error adding log' }, { status: 500 });
  }
}
