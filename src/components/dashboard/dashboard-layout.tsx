import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Database, BarChart, FileText, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { DashboardGradient } from '@/components/gradients/dashboard-gradient';
import { Footer } from '@/components/home/footer/footer';
import Image from 'next/image';
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown';
import { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/dashboard-card.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
    { name: 'Data', href: '/dashboard/data', icon: <Database size={18} /> },
    { name: 'Analyze', href: '/dashboard/analyze', icon: <BarChart size={18} /> },
    { name: 'Reports', href: '/dashboard/reports', icon: <FileText size={18} />, disabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B131380] flex flex-col">
      <DashboardGradient />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <Link href="/" className="flex items-center mb-2 sm:mb-0">
          <Image src="/logo.svg" width={220} height={28} alt="InsightHub" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <p className="text-muted-foreground mr-2 hidden sm:block text-sm">
            Welcome,{' '}
            <span className="font-medium text-foreground">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
          </p>
          <ProfileDropdown />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-1 md:space-x-2 mb-6 sm:mb-8 space-y-2 sm:space-y-0 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'outline'}
                  size="sm"
                  asChild={!item.disabled}
                  disabled={item.disabled}
                  className={`${isActive ? 'bg-accent' : ''} w-full sm:w-auto justify-start sm:justify-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {!item.disabled ? (
                    <Link href={item.href} className="flex items-center gap-1">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1 opacity-50">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-10">{children}</main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
