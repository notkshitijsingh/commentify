'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const FullScreenLoader = () => (
    <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-2 md:p-4 border-b shrink-0">
            <div className="flex items-center gap-2 md:gap-4">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="h-7 w-32" />
            </div>
            <div className="flex-grow flex justify-center items-center gap-2 md:gap-4">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-11 w-36" />
            </div>
            <div className="flex items-center gap-4">
               <Skeleton className="h-10 w-24" />
            </div>
        </header>
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden relative">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </main>
    </div>
)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // By checking typeof window, we can ensure this effect only runs in the browser.
  // This prevents Firebase from trying to initialize during the server-side build process.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
        // On the server, we immediately set loading to false.
        setLoading(false);
    }
  }, []);

  // During the server build or initial client load, show a loader.
  if (loading) {
    return <FullScreenLoader />;
  }

  // On the server, if not loading, just render children without the context value.
  // The context value is only useful on the client where `user` is populated.
  if (typeof window === 'undefined') {
      return <>{children}</>;
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
