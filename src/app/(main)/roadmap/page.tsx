
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Task, Milestone } from '@/lib/types';
import { TaskCard } from '@/components/roadmap/task-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock } from 'lucide-react';

// Mock data - consider moving to a separate file or fetching if it grows
const mockMilestones: Milestone[] = [
  { id: 'm1', title: 'Q3 Sprint 1', description: 'Initial feature development', status: 'open', dueDate: new Date('2024-08-15') },
  { id: 'm2', title: 'Q3 Sprint 2', description: 'Refinement and testing', status: 'open', dueDate: new Date('2024-08-30') },
  { id: 'm3', title: 'Q4 Launch Prep', description: 'Final preparations for launch', status: 'open', dueDate: new Date('2024-09-15') },
  { id: 'm4', title: 'Post-Launch', description: 'Monitoring and bug fixes', status: 'open' },
];

const mockTasks: Task[] = [
  { id: 't1', title: 'Setup Monitoring Dashboard', milestoneId: 'm1', status: 'done', createdAt: new Date('2024-07-01'), updatedAt: new Date(), priority: 'high', dueDate: new Date('2024-07-20'), description: 'Implement the real-time log monitoring page.' },
  { id: 't2', title: 'Develop Roadmap UI (Simplified)', milestoneId: 'm1', status: 'inprogress', createdAt: new Date('2024-07-05'), updatedAt: new Date(), priority: 'high', assignee: 'AI Team', dueDate: new Date('2024-07-28'), description: 'Create the simplified project roadmap feed.' },
  { id: 't3', title: 'Implement Idea Submission Form', milestoneId: 'm1', status: 'todo', createdAt: new Date('2024-07-10'), updatedAt: new Date(), priority: 'medium', description: 'Build the form for users to submit new ideas.' },
  { id: 't4', title: 'Integrate AI for Idea Refinement', milestoneId: 'm2', status: 'todo', createdAt: new Date('2024-07-15'), updatedAt: new Date(), priority: 'high', dueDate: new Date('2024-08-10'), description: 'Connect the idea submission to the AI workflow.' },
  { id: 't5', title: 'Design Task Grooming Interface (Mock)', milestoneId: 'm2', status: 'todo', createdAt: new Date('2024-07-20'), updatedAt: new Date(), priority: 'medium', description: 'Basic UI for AI-assisted task grooming placeholder.' },
  { id: 't6', title: 'User Testing Phase 1', milestoneId: 'm3', status: 'todo', createdAt: new Date(), updatedAt: new Date(), priority: 'high', dueDate: new Date('2024-09-05'), description: 'Conduct first round of user testing.' },
  { id: 't7', title: 'Review Backend Logging', milestoneId: 'm1', status: 'todo', createdAt: new Date('2024-07-25'), updatedAt: new Date(), priority: 'medium', description: 'Ensure server logs are captured and served correctly.' },
  { id: 't8', title: 'Mobile Styling for Activity Feed', milestoneId: 'm2', status: 'todo', createdAt: new Date('2024-08-01'), updatedAt: new Date(), priority: 'medium', dueDate: new Date('2024-08-20'), description: 'Optimize activity feed for mobile views.' },
];


export default function RoadmapPage() {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | 'all'>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setTasks(mockTasks);
      setMilestones(mockMilestones);
      setIsLoading(false);
    }, 500); // Shorter delay for mocks
  }, []);
  
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = selectedMilestoneId === 'all'
      ? tasks
      : tasks.filter(task => task.milestoneId === selectedMilestoneId);

    return filtered.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1; // Tasks with due dates come first
      if (b.dueDate) return 1;
      // If no due dates, sort by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks, selectedMilestoneId]);


  if (isLoading) {
    return (
      <div className="flex flex-col h-full gap-6">
        <header className="mb-2">
          <Skeleton className="h-10 w-1/2 mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </header>
        <Skeleton className="h-10 w-full mb-4" /> {/* Placeholder for Tabs */}
        <div className="flex-1 space-y-4">
          {Array.from({length: 3}).map((_,i) => (
            <div key={i} className="p-4 border rounded-lg bg-card">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Project Roadmap</h1>
        <p className="text-muted-foreground">
          A feed of planned tasks. Filter by milestone using the tabs below.
        </p>
      </header>

      <Tabs value={selectedMilestoneId} onValueChange={setSelectedMilestoneId} defaultValue="all" className="mb-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-none md:flex">
          <TabsTrigger value="all" className="flex-1 md:flex-none">All Tasks</TabsTrigger>
          {milestones.map(milestone => (
            <TabsTrigger key={milestone.id} value={milestone.id} className="flex-1 md:flex-none">
              {milestone.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <ScrollArea className="flex-1 pb-4 -mx-1">
        {filteredAndSortedTasks.length > 0 ? (
          <div className="space-y-4 px-1">
            {filteredAndSortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center py-10">
            <CalendarClock className="h-16 w-16 mb-4" />
            <p className="text-lg">No tasks found for this selection.</p>
            <p>Try a different milestone or add tasks to your project.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
