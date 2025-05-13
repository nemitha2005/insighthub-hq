import * as React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, fallback, className, size = 'md', ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (src) {
      setImageError(false);
    }
  }, [src]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeClasses[size], className)} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          className="h-full w-full object-cover"
          alt="User avatar"
          onError={() => {
            console.error('Failed to load image:', src);
            setImageError(true);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          {fallback || <User className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
}
