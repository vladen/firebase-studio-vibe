
import type { Milestone, Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MilestoneColumnProps {
  milestone: Milestone;
  tasks: Task[];
}

export function MilestoneColumn({ milestone, tasks }: MilestoneColumnProps) {
  return (
    <div className="flex flex-col h-full w-80 md:w-96 rounded-lg bg-card p-4 shadow-md flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
      </div>
      {milestone.description && <p className="text-xs text-muted-foreground mb-3">{milestone.description}</p>}
      {milestone.dueDate && <p className="text-xs text-muted-foreground mb-3">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this milestone.</p>
          )}
        </div>
      </ScrollArea>
      <Button variant="outline" size="sm" className="mt-4 w-full">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}
