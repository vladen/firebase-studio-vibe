
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleIdeaSubmissionAction, type ActionResult } from '@/app/actions';
import type { RefineIdeaOutput } from '@/ai/flows/refine-idea-workflow';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2 } from 'lucide-react';

const ideaFormSchema = z.object({
  ideaText: z.string().min(10, { message: "Idea must be at least 10 characters." }).max(1000, { message: "Idea must not exceed 1000 characters." }),
});

type IdeaFormValues = z.infer<typeof ideaFormSchema>;

interface IdeaFormProps {
  onIdeaSubmitted: (originalIdeaText: string, refinedIdea: RefineIdeaOutput) => void;
}

export function IdeaForm({ onIdeaSubmitted }: IdeaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      ideaText: '',
    },
  });

  async function onSubmit(values: IdeaFormValues) {
    setIsSubmitting(true);
    try {
      const result: ActionResult<RefineIdeaOutput> = await handleIdeaSubmissionAction(values.ideaText);
      if (result.success && result.data) {
        onIdeaSubmitted(values.ideaText, result.data);
        toast({
          title: "💡 Idea Refined!",
          description: `"${result.data.issueTitle}" has been processed.`,
          variant: "default",
        });
        form.reset();
      } else {
        throw new Error(result.error || "Failed to submit idea.");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
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
          <Lightbulb className="mr-2 h-6 w-6 text-primary" />
          Submit a New Idea
        </CardTitle>
        <CardDescription>
          Share your thoughts, feature requests, or bug reports. Our AI will help refine it!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="ideaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="ideaText">Your Idea</FormLabel>
                  <FormControl>
                    <Textarea
                      id="ideaText"
                      placeholder="Describe your brilliant idea, feature request, or bug report here..."
                      className="min-h-[120px] resize-y"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
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
                  Submitting & Refining...
                </>
              ) : (
                "Submit Idea"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
