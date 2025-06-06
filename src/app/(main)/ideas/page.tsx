
"use client";

import { useState, useEffect } from 'react';
import { IdeaForm } from '@/components/ideas/idea-form';
import { RefinedIdeaCard } from '@/components/ideas/idea-card';
import type { Idea } from '@/lib/types';
import type { RefineIdeaOutput } from '@/ai/flows/refine-idea-workflow';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';

const MAX_DISPLAYED_IDEAS = 10;

export default function IdeasPage() {
  const [refinedIdeas, setRefinedIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial load if fetching persisted ideas

  // Effect for loading initial ideas (if any were persisted)
  useEffect(() => {
    // Simulate fetching persisted ideas. In a real app, this would be an API call.
    // For now, we'll start with an empty list.
    const loadPersistedIdeas = async () => {
      // Example: const fetchedIdeas = await fetch('/api/ideas').then(res => res.json());
      // setRefinedIdeas(fetchedIdeas);
      setIsLoading(false);
    };
    loadPersistedIdeas();
  }, []);

  const handleNewRefinedIdea = (refinedOutput: RefineIdeaOutput) => {
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      text: "Original idea text would be here if passed from form component", // This needs to be passed properly or state managed higher
      submittedAt: new Date(),
      status: 'review', // Default status after AI refinement
      refinedTitle: refinedOutput.issueTitle,
      refinedBody: refinedOutput.issueBody,
      refinedLabels: refinedOutput.labels,
      refinedMilestone: refinedOutput.milestone,
    };
    setRefinedIdeas(prevIdeas => [newIdea, ...prevIdeas].slice(0, MAX_DISPLAYED_IDEAS));
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Idea Backlog & Submission</h1>
        <p className="text-muted-foreground">
          Submit your innovative ideas and see them refined by AI into actionable tasks.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="md:col-span-1">
          <IdeaForm onIdeaSubmitted={handleNewRefinedIdea} />
        </div>

        <div className="md:col-span-2 flex flex-col bg-card p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-foreground mb-4">Refined Ideas Backlog</h2>
          <Separator className="mb-4" />
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : refinedIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4" />
              <p className="text-lg">No refined ideas yet.</p>
              <p>Submit an idea to see it appear here!</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-4">
                {refinedIdeas.map(idea => (
                  <RefinedIdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
