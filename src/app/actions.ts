
"use server";

import { refineIdeaAndCreateIssue, type RefineIdeaInput, type RefineIdeaOutput } from '@/ai/flows/refine-idea-workflow';
import { suggestTaskGrooming, type SuggestTaskGroomingInput, type SuggestTaskGroomingOutput } from '@/ai/flows/suggest-task-grooming';
import { addServerLog } from '@/lib/logger';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function handleIdeaSubmissionAction(
  ideaText: string,
  projectDescription: string = "A Next.js web application for project monitoring and AI-assisted task management."
): Promise<ActionResult<RefineIdeaOutput>> {
  try {
    addServerLog(`New idea received: "${ideaText}"`, 'action', { flow: 'handleIdeaSubmission' });
    const input: RefineIdeaInput = { idea: ideaText, projectDescription };
    const refinedIdea = await refineIdeaAndCreateIssue(input);
    addServerLog(`Idea refined: "${refinedIdea.issueTitle}"`, 'success', { flow: 'handleIdeaSubmission', refinedIdea });
    
    // In a real app, you'd save this to a DB and/or create a GitHub issue.
    // For now, we just return the refined idea.
    return { success: true, data: refinedIdea };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during idea submission.";
    addServerLog(`Error refining idea: ${errorMessage}`, 'error', { flow: 'handleIdeaSubmission', ideaText });
    console.error("Error in handleIdeaSubmissionAction:", error);
    return { success: false, error: errorMessage };
  }
}

export async function handleTaskGroomingAction(
  codeReviewSummary: string,
  currentTasks: string[]
): Promise<ActionResult<SuggestTaskGroomingOutput>> {
  try {
    addServerLog('Task grooming requested.', 'action', { flow: 'handleTaskGrooming', summaryLength: codeReviewSummary.length, taskCount: currentTasks.length });
    const input: SuggestTaskGroomingInput = { codeReviewSummary, currentTasks };
    const suggestions = await suggestTaskGrooming(input);
    addServerLog('Task grooming suggestions generated.', 'success', { flow: 'handleTaskGrooming', suggestions });
    
    // In a real app, you might apply these suggestions or store them.
    // For now, we just return them.
    return { success: true, data: suggestions };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during task grooming.";
    addServerLog(`Error generating task grooming suggestions: ${errorMessage}`, 'error', { flow: 'handleTaskGrooming' });
    console.error("Error in handleTaskGroomingAction:", error);
    return { success: false, error: errorMessage };
  }
}
