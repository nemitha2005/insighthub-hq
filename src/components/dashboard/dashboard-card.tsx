import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DashboardCardGradient } from '@/components/gradients/dashboard-card-gradient';
import '../../styles/dashboard-card.css';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  featured?: boolean;
}

export function DashboardCard({ title, children, className, featured = false }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'dashboard-card border border-border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-ring/30 shadow-sm relative',
        featured && 'featured-dashboard-card',
        className,
      )}
    >
      {featured && <DashboardCardGradient />}
      <div className="border-b border-border p-5 bg-background/80">
        <h3 className={cn('text-xl font-semibold', featured && 'text-yellow-300')}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
