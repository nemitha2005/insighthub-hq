import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = 'Loading...', className }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
