'use client';

import { Code2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelect } from '../editor/LanguageSelect';
import UserNav from '../auth/UserNav';
import { CommentLevelSelect } from '../editor/CommentLevelSelect';
import { CommentLevel } from '@/lib/comment-levels';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  commentLevel: CommentLevel;
  setCommentLevel: (level: CommentLevel) => void;
  onGenerate: () => void;
  isLoading: boolean;
  history: any[];
  isHistoryLoading: boolean;
  loadFromHistory: (item: any) => void;
  fetchHistory: () => void;
}

export default function Header({
  language,
  setLanguage,
  commentLevel,
  setCommentLevel,
  onGenerate,
  isLoading,
  history,
  isHistoryLoading,
  loadFromHistory,
  fetchHistory,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-2 md:p-4 border-b shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        <Code2 className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold font-headline tracking-tight">
          Commentify
        </h1>
      </div>
      <div className="flex-grow flex justify-center items-center gap-2 md:gap-4">
        <LanguageSelect value={language} onChange={setLanguage} />
        <CommentLevelSelect value={commentLevel} onChange={setCommentLevel} />
        <Button onClick={onGenerate} disabled={isLoading} size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Commentify'}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <UserNav
          history={history}
          isHistoryLoading={isHistoryLoading}
          loadFromHistory={loadFromHistory}
          fetchHistory={fetchHistory}
        />
      </div>
    </header>
  );
}
