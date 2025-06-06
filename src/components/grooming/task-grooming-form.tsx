
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleTaskGroomingAction, type ActionResult } from '@/app/actions';
import type { SuggestTaskGroomingOutput } from '@/ai/flows/suggest-task-grooming';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GitMerge, Sparkles } from 'lucide-react';

const taskGroomingFormSchema = z.object({
  codeReviewSummary: z.string().min(20, { message: "Code review summary must be at least 20 characters." }).max(2000),
  currentTasks: z.string().min(10, { message: "Please list at least one task." }).max(2000)
    .refine(value => value.split('\n').filter(Boolean).length > 0, { message: "Please list at least one task, each on a new line."}),
});

type TaskGroomingFormValues = z.infer<typeof taskGroomingFormSchema>;

interface TaskGroomingFormProps {
  onSuggestionsReceived: (suggestions: SuggestTaskGroomingOutput, originalTasks: string[]) => void;
}

export function TaskGroomingForm({ onSuggestionsReceived }: TaskGroomingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskGroomingFormValues>({
    resolver: zodResolver(taskGroomingFormSchema),
    defaultValues: {
      codeReviewSummary: '',
      currentTasks: '',
    },
  });

  async function onSubmit(values: TaskGroomingFormValues) {
    setIsSubmitting(true);
    const tasksArray = values.currentTasks.split('\n').map(task => task.trim()).filter(Boolean);

    try {
      const result: ActionResult<SuggestTaskGroomingOutput> = await handleTaskGroomingAction(values.codeReviewSummary, tasksArray);
      if (result.success && result.data) {
        onSuggestionsReceived(result.data, tasksArray);
        toast({
          title: "✨ AI Grooming Complete!",
          description: "Suggestions for your tasks are ready.",
        });
        // form.reset(); // Optionally reset form, or keep values for reference
      } else {
        throw new Error(result.error || "Failed to get grooming suggestions.");
      }
    } catch (error) {
      toast({
        title: "Grooming Error",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <GitMerge className="mr-2 h-6 w-6 text-primary" />
          AI Task Grooming Assistant
        </CardTitle>
        <CardDescription>
          Provide a code review summary and current tasks to get AI-powered grooming suggestions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="codeReviewSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="codeReviewSummary">Code Review Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      id="codeReviewSummary"
                      placeholder="Paste the summary of the recent code review here..."
                      className="min-h-[100px] resize-y"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentTasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="currentTasks">Current Tasks</FormLabel>
                  <FormControl>
                    <Textarea
                      id="currentTasks"
                      placeholder="List current tasks, one per line. E.g.,&#10;Fix login bug&#10;Implement user profile page&#10;Update documentation"
                      className="min-h-[120px] resize-y font-code"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each task on a new line. These will be used by the AI for reordering and suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Grooming Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
