
export type LogLevel = 'info' | 'warning' | 'error' | 'success' | 'action' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level: LogLevel;
  emoji: string;
  source: 'client' | 'server';
  details?: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done' | 'review';
  milestoneId?: string;
  dueDate?: Date;
  assignee?: string;
  labels?: string[];
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'open' | 'closed';
}

export interface Idea {
  id: string;
  text: string;
  submittedAt: Date;
  status: 'new' | 'review' | 'accepted' | 'rejected';
  refinedTitle?: string;
  refinedBody?: string;
  refinedLabels?: string[];
  refinedMilestone?: string;
}
