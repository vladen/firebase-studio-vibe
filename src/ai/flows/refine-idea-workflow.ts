// refine-idea-workflow.ts
'use server';

/**
 * @fileOverview This flow refines user-submitted ideas into well-structured GitHub issues with labels and milestone assignments.
 *
 * - refineIdeaAndCreateIssue - A function that refines an idea and generates a GitHub issue.
 * - RefineIdeaInput - The input type for the refineIdeaAndCreateIssue function.
 * - RefineIdeaOutput - The return type for the refineIdeaAndCreateIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineIdeaInputSchema = z.object({
  idea: z.string().describe('The user-submitted idea.'),
  projectDescription: z.string().describe('Description of the project for context.'),
});
export type RefineIdeaInput = z.infer<typeof RefineIdeaInputSchema>;

const RefineIdeaOutputSchema = z.object({
  issueTitle: z.string().describe('The title of the generated GitHub issue.'),
  issueBody: z.string().describe('The detailed description for the GitHub issue.'),
  labels: z.array(z.string()).describe('Labels to apply to the GitHub issue.'),
  milestone: z.string().describe('The milestone to assign the GitHub issue to.'),
});
export type RefineIdeaOutput = z.infer<typeof RefineIdeaOutputSchema>;

export async function refineIdeaAndCreateIssue(
  input: RefineIdeaInput
): Promise<RefineIdeaOutput> {
  return refineIdeaFlow(input);
}

const refineIdeaPrompt = ai.definePrompt({
  name: 'refineIdeaPrompt',
  input: {schema: RefineIdeaInputSchema},
  output: {schema: RefineIdeaOutputSchema},
  prompt: `You are an AI assistant helping to refine user-submitted ideas into well-structured GitHub issues.

  Given the following user idea and project description, generate an appropriate issue title, detailed issue body, relevant labels, and a suitable milestone.

  Project Description: {{{projectDescription}}}
  User Idea: {{{idea}}}

  Ensure the output is well-formatted and suitable for creating a GitHub issue.
  Consider relevant labels such as 'feature request', 'bug', 'enhancement', etc.
`,
});

const refineIdeaFlow = ai.defineFlow(
  {
    name: 'refineIdeaFlow',
    inputSchema: RefineIdeaInputSchema,
    outputSchema: RefineIdeaOutputSchema,
  },
  async input => {
    const {output} = await refineIdeaPrompt(input);
    return output!;
  }
);
