export type CommentLevel = 'light' | 'balanced' | 'detailed';

export const COMMENT_LEVELS: { value: CommentLevel; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'detailed', label: 'Detailed' },
];
