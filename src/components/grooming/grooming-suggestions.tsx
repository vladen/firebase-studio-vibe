
import type { SuggestTaskGroomingOutput } from '@/ai/flows/suggest-task-grooming';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListOrdered, MessageSquare, Tag, CheckSquare, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface GroomingSuggestionsProps {
  suggestions: SuggestTaskGroomingOutput;
  originalTasks: string[];
}

export function GroomingSuggestions({ suggestions, originalTasks }: GroomingSuggestionsProps) {
  const reorderedTasks = suggestions.suggestedTaskOrder.map(index => originalTasks[index]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-6 w-6 text-primary" />
          AI Grooming Suggestions
        </CardTitle>
        <CardDescription>
          Review the AI's suggestions for your tasks. You can apply these to your project management tool.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.suggestedTaskOrder && originalTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ListOrdered className="mr-2 h-5 w-5 text-muted-foreground" />
              Suggested Task Order
            </h3>
            <ol className="list-decimal list-inside space-y-1 pl-2 rounded-md border p-3 bg-secondary/30">
              {reorderedTasks.map((task, index) => (
                <li key={index} className="text-sm text-foreground">
                  {task}
                  {originalTasks.indexOf(task) !== index && (
                    <span className="text-xs text-muted-foreground ml-2">(was #{originalTasks.indexOf(task) + 1})</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {suggestions.suggestedLabels && suggestions.suggestedLabels.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
              Suggested Labels
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.suggestedLabels.map((label, index) => (
                <Badge key={index} variant="outline" className="text-sm">{label}</Badge>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-1">Apply these labels to relevant tasks.</p>
          </div>
        )}

        {suggestions.suggestedComments && suggestions.suggestedComments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-muted-foreground" />
              Suggested Comments
            </h3>
            <div className="space-y-2">
              {suggestions.suggestedComments.map((comment, index) => (
                <p key={index} className="text-sm p-2 border rounded-md bg-secondary/30 text-foreground">
                  "{comment}"
                </p>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Consider adding these comments to the respective tasks.</p>
          </div>
        )}
        
        {(suggestions.suggestedLabels.length === 0 && suggestions.suggestedComments.length === 0 && suggestions.suggestedTaskOrder.length === 0) && (
            <p className="text-muted-foreground text-center py-4">No specific suggestions provided by AI for this input.</p>
        )}

      </CardContent>
       { (suggestions.suggestedLabels.length > 0 || suggestions.suggestedComments.length > 0 || suggestions.suggestedTaskOrder.length > 0) && (
         <CardContent className="border-t pt-4">
            <Button className="w-full">
              <CheckSquare className="mr-2 h-4 w-4" />
              Mark as Reviewed / Apply (Conceptual)
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              In a full integration, this could trigger updates in your project management tool.
            </p>
         </CardContent>
       )}
    </Card>
  );
}
