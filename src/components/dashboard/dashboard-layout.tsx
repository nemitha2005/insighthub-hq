import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardGradient } from '@/components/gradients/dashboard-gradient';
import { Footer } from '@/components/home/footer/footer';
import Image from 'next/image';
import '../../styles/dashboard.css';
import '../../styles/dashboard-card.css';

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
    <div className="min-h-screen bg-[#0B131380] flex flex-col">
      <DashboardGradient />

      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" width={220} height={34} alt="InsightHub" />
        </Link>

        <div className="flex items-center gap-4">
          <p className="text-muted-foreground mr-2">
            Welcome,{' '}
            <span className="font-medium text-foreground">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout} className="flex items-center gap-1">
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 relative z-10">{children}</main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
