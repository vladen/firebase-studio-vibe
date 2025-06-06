
import type { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, ListTodo, Tag, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

const statusColors: Record<Task['status'], string> = {
  todo: 'bg-gray-500',
  inprogress: 'bg-blue-500',
  done: 'bg-green-500',
  review: 'bg-purple-500',
};

const priorityColors: Record<NonNullable<Task['priority']>, string> = {
  low: 'border-green-500 text-green-500',
  medium: 'border-yellow-500 text-yellow-500',
  high: 'border-red-500 text-red-500',
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold mb-1">{task.title}</CardTitle>
          {task.priority && (
            <Badge variant="outline" className={cn("text-xs capitalize", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {task.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <ListTodo className="h-4 w-4 mr-2 text-primary" />
          Status: <Badge variant="secondary" className={cn("ml-1 capitalize text-xs", statusColors[task.status], "text-white")}>{task.status}</Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </div>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="h-4 w-4 mr-2 text-primary" />
            Labels:
            <div className="ml-1 flex flex-wrap gap-1">
              {task.labels.map(label => (
                <Badge key={label} variant="outline" className="text-xs">{label}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4">
        <span>Created: {format(new Date(task.createdAt), 'MMM dd')}</span>
        {task.assignee ? (
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-1">
              <AvatarImage src={`https://i.pravatar.cc/40?u=${task.assignee}`} alt={task.assignee} data-ai-hint="person avatar" />
              <AvatarFallback>{task.assignee.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            {task.assignee}
          </div>
        ) : (
          <div className="flex items-center">
             <UserCircle2 className="h-4 w-4 mr-1" />
             Unassigned
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
