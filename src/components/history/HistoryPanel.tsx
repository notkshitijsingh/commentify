'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ReactNode, useState, useEffect } from 'react';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface HistoryPanelProps {
  children: ReactNode;
  history: any[];
  isHistoryLoading: boolean;
  loadFromHistory: (item: any) => void;
  fetchHistory: () => void;
}

export function HistoryPanel({
  children,
  history,
  isHistoryLoading,
  loadFromHistory,
  fetchHistory,
}: HistoryPanelProps) {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user, fetchHistory]);

  const handleSelectHistory = (item: any) => {
    loadFromHistory(item);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Comment History</SheetTitle>
          <SheetDescription>Here are your previously commented code snippets.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-4rem)] mt-4 pr-4">
          <div className="space-y-4">
            {isHistoryLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))
            ) : history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => handleSelectHistory(item)}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-medium text-primary font-code">
                      {item.language}
                    </p>
                    <p className="text-xs text-muted-foreground font-code">
                      {item.originalCode}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.timestamp
                        ? formatDistanceToNow(
                            new Timestamp(item.timestamp.seconds, item.timestamp.nanoseconds).toDate(),
                            { addSuffix: true }
                          )
                        : 'some time ago'}
                    </p>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No history found.</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
