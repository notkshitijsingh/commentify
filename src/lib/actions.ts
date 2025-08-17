'use server';

import { commentCode } from '@/ai/flows/comment-code';
import { z } from 'zod';

const generateSchema = z.object({
  code: z.string(),
  language: z.string(),
  commentLevel: z.enum(['light', 'balanced', 'detailed']),
});

export async function generateCommentsAction(input: z.infer<typeof generateSchema>) {
  const validatedInput = generateSchema.parse(input);
  return await commentCode(validatedInput);
}
