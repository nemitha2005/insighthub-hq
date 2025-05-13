import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-ring/30 shadow-sm',
        className,
      )}
    >
      <div className="border-b border-border p-4 bg-background/80">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
