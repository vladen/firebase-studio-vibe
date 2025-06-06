
"use client";

import { useState } from 'react';
import { TaskGroomingForm } from '@/components/grooming/task-grooming-form';
import { GroomingSuggestions } from '@/components/grooming/grooming-suggestions';
import type { SuggestTaskGroomingOutput } from '@/ai/flows/suggest-task-grooming';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';

export default function GroomingPage() {
  const [groomingSuggestions, setGroomingSuggestions] = useState<SuggestTaskGroomingOutput | null>(null);
  const [originalTasksForDisplay, setOriginalTasksForDisplay] = useState<string[]>([]);

  const handleNewSuggestions = (suggestions: SuggestTaskGroomingOutput, originalTasks: string[]) => {
    setGroomingSuggestions(suggestions);
    setOriginalTasksForDisplay(originalTasks);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">AI-Powered Task Grooming</h1>
        <p className="text-muted-foreground">
          Let AI assist in refining your project tasks after code reviews or planning sessions.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="md:col-span-1">
          <TaskGroomingForm onSuggestionsReceived={handleNewSuggestions} />
        </div>

        <div className="md:col-span-1 flex flex-col">
          {groomingSuggestions ? (
            <GroomingSuggestions suggestions={groomingSuggestions} originalTasks={originalTasksForDisplay} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-card p-6 rounded-lg shadow-md text-center">
              <Bot className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Awaiting Input</h2>
              <p className="text-muted-foreground">
                Fill out the form on the left to get AI-powered task grooming suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
