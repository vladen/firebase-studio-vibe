
import type { Idea } from '@/lib/types'; // Assuming Idea type includes refined fields
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Milestone as MilestoneIcon, Tag, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RefinedIdeaCardProps {
  idea: Idea;
}

export function RefinedIdeaCard({ idea }: RefinedIdeaCardProps) {
  const timeAgo = formatDistanceToNow(new Date(idea.submittedAt), { addSuffix: true });

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
             <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            {idea.refinedTitle || "Untitled Idea"}
          </CardTitle>
          <Badge variant={idea.status === 'accepted' ? 'default' : 'secondary'} className="capitalize">
            {idea.status === 'accepted' && <CheckCircle className="mr-1 h-3 w-3" />}
            {idea.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Original submission: {idea.text.substring(0,100)}{idea.text.length > 100 ? "..." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {idea.refinedBody && (
          <p className="text-sm text-foreground line-clamp-3">{idea.refinedBody}</p>
        )}
        {idea.refinedMilestone && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MilestoneIcon className="h-4 w-4 mr-1 text-primary" />
            Milestone: {idea.refinedMilestone}
          </div>
        )}
        {idea.refinedLabels && idea.refinedLabels.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="h-4 w-4 mr-1 text-primary" />
            Labels: 
            <div className="ml-1 flex flex-wrap gap-1">
            {idea.refinedLabels.map(label => (
              <Badge key={label} variant="outline" className="text-xs">{label}</Badge>
            ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" /> Submitted {timeAgo}
      </CardFooter>
    </Card>
  );
}
