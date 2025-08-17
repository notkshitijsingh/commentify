'use client';

import type { editor } from 'monaco-editor';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateCommentsAction } from '@/lib/actions';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import ActionsToolbar from '@/components/editor/ActionsToolbar';
import LoadingDots from '@/components/ui/LoadingDots';
import { Card } from '@/components/ui/card';
import { CommentLevel } from '@/lib/comment-levels';
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted/50 animate-pulse rounded-lg" />,
});

const defaultCode = `function helloWorld() {
  console.log("Hello, world!");
}`;

export default function Home() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [originalCode, setOriginalCode] = useState<string>(defaultCode);
  const [commentedCode, setCommentedCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [commentLevel, setCommentLevel] = useState<CommentLevel>('balanced');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  const originalEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const commentedEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setIsHistoryLoading(true);
    try {
      const q = query(collection(db, 'users', user.uid, 'history'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching history: ', error);
      toast({
        title: 'Error Fetching History',
        description: 'Could not load your saved comments.',
        variant: 'destructive',
      });
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user, fetchHistory]);

  const handleGenerate = async () => {
    if (!originalCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some code to comment.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setCommentedCode('');
    try {
      const result = await generateCommentsAction({ code: originalCode, language, commentLevel });
      setCommentedCode(result.commentedCode);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Comments',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: 'Please log in to save history.', variant: 'destructive' });
      return;
    }
    if (!commentedCode) {
      toast({ title: 'No commented code to save.', variant: 'destructive' });
      return;
    }

    try {
      const historyCollection = collection(db, 'users', user.uid, 'history');
      await addDoc(historyCollection, {
        originalCode,
        commentedCode,
        language,
        timestamp: serverTimestamp(),
      });

      toast({ title: 'Success', description: 'Saved to your history.' });
      fetchHistory(); // Refresh history after saving
    } catch (error) {
      console.error('Error saving history: ', error);
      toast({
        title: 'Error Saving History',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const loadFromHistory = (item: any) => {
    setOriginalCode(item.originalCode);
    setCommentedCode(item.commentedCode);
    setLanguage(item.language);
  };

  const syncScroll = useCallback((source: 'original' | 'commented') => {
    if (!originalEditorRef.current || !commentedEditorRef.current) return;

    const sourceEditor = source === 'original' ? originalEditorRef.current : commentedEditorRef.current;
    const targetEditor = source === 'original' ? commentedEditorRef.current : originalEditorRef.current;

    const onScroll = sourceEditor.onDidScrollChange((e) => {
      if (e.scrollTopChanged) {
        targetEditor.setScrollTop(e.scrollTop);
      }
    });

    return () => onScroll.dispose();
  }, []);

  useEffect(() => {
    const dispose = syncScroll('original');
    return () => {
      if (dispose) {
        dispose();
      }
    };
  }, [syncScroll]);

  useEffect(() => {
    const dispose = syncScroll('commented');
    return () => {
      if (dispose) {
        dispose();
      }
    };
  }, [syncScroll]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header
        language={language}
        setLanguage={setLanguage}
        commentLevel={commentLevel}
        setCommentLevel={setCommentLevel}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        history={history}
        isHistoryLoading={isHistoryLoading}
        loadFromHistory={loadFromHistory}
        fetchHistory={fetchHistory}
      />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden relative">
        <Card className="flex flex-col overflow-hidden shadow-lg">
          <div className="p-2 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground">Original Code</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              editorRef={originalEditorRef}
              value={originalCode}
              onChange={(value) => setOriginalCode(value || '')}
              language={language}
            />
          </div>
        </Card>
        <Card className="flex flex-col overflow-hidden relative shadow-lg">
          <div className="p-2 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground">Commentified Code</h2>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-muted/80 flex items-center justify-center z-10">
                <LoadingDots />
              </div>
            )}
            <CodeEditor
              editorRef={commentedEditorRef}
              value={commentedCode}
              language={language}
              readOnly
            />
          </div>
        </Card>
        <ActionsToolbar
          commentedCode={commentedCode}
          onSave={handleSave}
          language={language}
        />
      </main>
    </div>
  );
}
