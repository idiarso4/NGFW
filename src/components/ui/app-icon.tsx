import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/utils';

interface AppIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

export function AppIcon({ size = 'md', className, showBadge = false }: AppIconProps) {
  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-lg bg-primary-600 text-white',
        sizeClasses[size]
      )}>
        <Shield className={cn(
          'text-white',
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5',
          size === 'xl' && 'h-6 w-6'
        )} />
      </div>
      
      {showBadge && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white">
          <div className="h-full w-full bg-red-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
