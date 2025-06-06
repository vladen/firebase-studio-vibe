
"use client";

import { useState, useEffect } from 'react';
import type { Task, Milestone } from '@/lib/types';
import { MilestoneColumn } from '@/components/roadmap/milestone-column';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const mockMilestones: Milestone[] = [
  { id: 'm1', title: 'Q3 Sprint 1', description: 'Initial feature development', status: 'open', dueDate: new Date('2024-08-15') },
  { id: 'm2', title: 'Q3 Sprint 2', description: 'Refinement and testing', status: 'open', dueDate: new Date('2024-08-30') },
  { id: 'm3', title: 'Q4 Launch Prep', description: 'Final preparations for launch', status: 'open', dueDate: new Date('2024-09-15') },
  { id: 'm4', title: 'Post-Launch', description: 'Monitoring and bug fixes', status: 'open' },
];

const mockTasks: Task[] = [
  { id: 't1', title: 'Setup Monitoring Dashboard', milestoneId: 'm1', status: 'done', createdAt: new Date('2024-07-01'), updatedAt: new Date(), priority: 'high', dueDate: new Date('2024-07-20'), description: 'Implement the real-time log monitoring page.' },
  { id: 't2', title: 'Develop Roadmap UI', milestoneId: 'm1', status: 'inprogress', createdAt: new Date('2024-07-05'), updatedAt: new Date(), priority: 'high', assignee: 'AI Team', dueDate: new Date('2024-07-28'), description: 'Create the project roadmap visualization page.' },
  { id: 't3', title: 'Implement Idea Submission Form', milestoneId: 'm1', status: 'todo', createdAt: new Date('2024-07-10'), updatedAt: new Date(), priority: 'medium', description: 'Build the form for users to submit new ideas.' },
  { id: 't4', title: 'Integrate AI for Idea Refinement', milestoneId: 'm2', status: 'todo', createdAt: new Date('2024-07-15'), updatedAt: new Date(), priority: 'high', description: 'Connect the idea submission to the AI workflow.' },
  { id: 't5', title: 'Design Task Grooming Interface', milestoneId: 'm2', status: 'todo', createdAt: new Date('2024-07-20'), updatedAt: new Date(), priority: 'medium', description: 'UI for AI-assisted task grooming.' },
  { id: 't6', title: 'User Testing Phase 1', milestoneId: 'm3', status: 'todo', createdAt: new Date(), updatedAt: new Date(), priority: 'high', description: 'Conduct first round of user testing.' },
];

const getDaysInView = (currentDate: Date, numDays: number = 7) => {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: numDays }).map((_, i) => addDays(start, i));
};

export default function RoadmapPage() {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | 'all'>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTimelineDate, setCurrentTimelineDate] = useState(new Date());
  const [timelineDays, setTimelineDays] = useState<Date[]>([]);
  const [timelineView, setTimelineView] = useState<'milestones' | 'timeline'>('milestones');

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setTasks(mockTasks);
      setMilestones(mockMilestones);
      setTimelineDays(getDaysInView(currentTimelineDate));
      setIsLoading(false);
    }, 1000);
  }, [currentTimelineDate]);
  
  const filteredTasks = selectedMilestoneId === 'all'
    ? tasks
    : tasks.filter(task => task.milestoneId === selectedMilestoneId);

  const tasksByMilestone = (milestoneId: string) => tasks.filter(task => task.milestoneId === milestoneId);

  const handlePrevWeek = () => setCurrentTimelineDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setCurrentTimelineDate(prev => addDays(prev, 7));
  const handleToday = () => setCurrentTimelineDate(new Date());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({length: 3}).map((_,i) => (
            <Skeleton key={i} className="h-[500px] w-96 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Project Roadmap</h1>
        <p className="text-muted-foreground">Visualize project progress and upcoming tasks.</p>
      </header>

      <Tabs defaultValue="milestones" onValueChange={(value) => setTimelineView(value as 'milestones' | 'timeline')} className="mb-4">
        <TabsList>
          <TabsTrigger value="milestones">Milestone View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>
      </Tabs>

      {timelineView === 'milestones' && (
        <>
          <div className="mb-4">
            <Tabs value={selectedMilestoneId} onValueChange={setSelectedMilestoneId} defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                {milestones.map(milestone => (
                  <TabsTrigger key={milestone.id} value={milestone.id}>{milestone.title}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {selectedMilestoneId === 'all' ? (
            <ScrollArea className="flex-1 pb-4 -mx-2">
              <div className="flex gap-4 px-2 h-[calc(100vh-280px)]"> {/* Adjust height as needed */}
                {milestones.map(milestone => (
                  <MilestoneColumn key={milestone.id} milestone={milestone} tasks={tasksByMilestone(milestone.id)} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="flex-1">
              {milestones.find(m => m.id === selectedMilestoneId) && (
                 <MilestoneColumn 
                    milestone={milestones.find(m => m.id === selectedMilestoneId)!} 
                    tasks={filteredTasks} />
              )}
            </div>
          )}
        </>
      )}
      
      {timelineView === 'timeline' && (
         <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 p-2 border rounded-md bg-card">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevWeek}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={handleToday}><CalendarDays className="h-4 w-4 mr-2" />Today</Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {format(timelineDays[0], 'MMM dd')} - {format(timelineDays[timelineDays.length - 1], 'MMM dd, yyyy')}
            </div>
          </div>
          <ScrollArea className="flex-1 rounded-md border bg-card">
            <div className="grid grid-cols-7 min-w-[1000px]">
              {timelineDays.map(day => (
                <div key={day.toString()} className="p-2 border-r border-b">
                  <div className={`text-center font-medium ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-center text-xs ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(day, 'dd')}
                  </div>
                </div>
              ))}
              {tasks.map(task => {
                if (!task.dueDate) return null;
                const taskDate = new Date(task.dueDate);
                const dayIndex = timelineDays.findIndex(d => format(d, 'yyyy-MM-dd') === format(taskDate, 'yyyy-MM-dd'));
                if (dayIndex === -1) return null;
                
                return (
                  <div
                    key={task.id}
                    className="col-start-[_placeholder_] p-1 m-1 bg-secondary rounded shadow hover:shadow-md cursor-pointer"
                    style={{ gridColumnStart: dayIndex + 1, gridRowStart: tasks.filter(t => t.dueDate && format(new Date(t.dueDate), 'yyyy-MM-dd') === format(taskDate, 'yyyy-MM-dd')).indexOf(task) + 2 }}
                    title={`${task.title} - Due: ${format(taskDate, 'MMM dd')}`}
                  >
                    <p className="text-xs font-medium truncate text-secondary-foreground">{task.title}</p>
                    {task.assignee && <p className="text-[10px] text-muted-foreground truncate">{task.assignee}</p>}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
