// 'use server';
/**
 * @fileOverview An AI agent for suggesting task grooming after code reviews.
 *
 * - suggestTaskGrooming - A function that handles the task grooming suggestion process.
 * - SuggestTaskGroomingInput - The input type for the suggestTaskGrooming function.
 * - SuggestTaskGroomingOutput - The return type for the suggestTaskGrooming function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskGroomingInputSchema = z.object({
  codeReviewSummary: z
    .string()
    .describe('A summary of the code review, including key changes and feedback.'),
  currentTasks: z
    .array(z.string())
    .describe('A list of current tasks in the backlog.'),
});
export type SuggestTaskGroomingInput = z.infer<typeof SuggestTaskGroomingInputSchema>;

const SuggestTaskGroomingOutputSchema = z.object({
  suggestedLabels: z
    .array(z.string())
    .describe('Suggested labels to apply to the tasks.'),
  suggestedComments: z
    .array(z.string())
    .describe('Suggested comments to add to the tasks.'),
  suggestedTaskOrder: z
    .array(z.number())
    .describe('Suggested reordering of the tasks (array of indices).'),
});
export type SuggestTaskGroomingOutput = z.infer<typeof SuggestTaskGroomingOutputSchema>;

export async function suggestTaskGrooming(input: SuggestTaskGroomingInput): Promise<SuggestTaskGroomingOutput> {
  return suggestTaskGroomingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskGroomingPrompt',
  input: {schema: SuggestTaskGroomingInputSchema},
  output: {schema: SuggestTaskGroomingOutputSchema},
  prompt: `You are an AI assistant that suggests how to groom tasks after a code review.\n\nBased on the following code review summary:\n\n{{codeReviewSummary}}\n\nAnd the following current tasks:\n\n{{#each currentTasks}}\n- {{{this}}}\n{{/each}}\n\nSuggest labels, comments, and a reordering of the tasks to reflect the code review. Return the reordering as an array of indices, where the index corresponds to the task as it appears in currentTasks.\n\nEnsure the output is a valid JSON object matching the schema.`,
});

const suggestTaskGroomingFlow = ai.defineFlow(
  {
    name: 'suggestTaskGroomingFlow',
    inputSchema: SuggestTaskGroomingInputSchema,
    outputSchema: SuggestTaskGroomingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
