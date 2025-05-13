import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, LogOut, User, BarChart3, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            InsightHub
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user?.displayName || user?.email}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home size={16} />
                <span className="hidden md:inline-block">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
              <LogOut size={16} />
              <span className="hidden md:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">© {new Date().getFullYear()} InsightHub. All rights reserved.</div>
      </footer>
    </div>
  );
}
