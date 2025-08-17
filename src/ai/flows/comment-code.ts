'use server';
/**
 * @fileOverview A code commenting AI agent.
 *
 * - commentCode - A function that handles the code commenting process.
 * - CommentCodeInput - The input type for the commentCode function.
 * - CommentCodeOutput - The return type for the commentCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommentCodeInputSchema = z.object({
  code: z.string().describe('The code to be commented.'),
  language: z.string().describe('The language of the code.'),
  commentLevel: z
    .enum(['light', 'balanced', 'detailed'])
    .describe('The desired level of commenting detail.'),
});
export type CommentCodeInput = z.infer<typeof CommentCodeInputSchema>;

const CommentCodeOutputSchema = z.object({
  commentedCode: z.string().describe('The commented code.'),
});
export type CommentCodeOutput = z.infer<typeof CommentCodeOutputSchema>;

export async function commentCode(input: CommentCodeInput): Promise<CommentCodeOutput> {
  return commentCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commentCodePrompt',
  input: {schema: CommentCodeInputSchema},
  output: {schema: CommentCodeOutputSchema},
  prompt: `You are an expert full-stack developer specializing in writing code comments.

  You will add comments to the code provided, and return the commented code.

  The user has requested a specific level of commenting detail: {{{commentLevel}}}.

  - If 'light', add only essential comments for labels and complex logic.
  - If 'balanced', add comments for labels, non-obvious logic, and function summaries.
  - If 'detailed', add comprehensive comments explaining all functions, logic, and data structures, as if for a beginner.

  The code is written in the following language: {{{language}}}

  Here is the code:
  {{{code}}}`,
});

const commentCodeFlow = ai.defineFlow(
  {
    name: 'commentCodeFlow',
    inputSchema: CommentCodeInputSchema,
    outputSchema: CommentCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
