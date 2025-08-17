'use client';

import { useAuthContext } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import AuthDialog from './AuthDialog';
import { HistoryPanel } from '../history/HistoryPanel';

interface UserNavProps {
  history: any[];
  isHistoryLoading: boolean;
  loadFromHistory: (item: any) => void;
  fetchHistory: () => void;
}

export default function UserNav({
  history,
  isHistoryLoading,
  loadFromHistory,
  fetchHistory,
}: UserNavProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Button variant="ghost" className="w-24 animate-pulse bg-muted"></Button>;
  }

  if (!user) {
    return (
      <AuthDialog>
        <Button>Sign In</Button>
      </AuthDialog>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <HistoryPanel
          history={history}
          isHistoryLoading={isHistoryLoading}
          loadFromHistory={loadFromHistory}
          fetchHistory={fetchHistory}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View History</DropdownMenuItem>
        </HistoryPanel>
        <DropdownMenuItem onClick={() => signOut(auth)}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
