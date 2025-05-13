import React, { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      console.log('Found photoURL:', user.photoURL);
      setProfileUrl(user.photoURL);
    } else {
      console.log('No photoURL found in user object');
      setProfileUrl(null);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-accent/50">
          <Avatar
            src={profileUrl}
            fallback={<span className="text-lg font-medium">{displayName.charAt(0).toUpperCase()}</span>}
            className="cursor-pointer border border-border/50"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-background/80 backdrop-blur-md border-border shadow-lg rounded-md"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 px-4 py-2 text-red-400 hover:text-red-300 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
