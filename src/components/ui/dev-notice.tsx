'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Database, ExternalLink } from 'lucide-react';
import { cn } from '@/utils';

interface DevNoticeProps {
  className?: string;
}

export function DevNotice({ className }: DevNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if user has dismissed the notice (only in browser)
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('dev-notice-dismissed');
      if (dismissed) {
        setIsDismissed(true);
        return;
      }
    }

    // Show notice after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev-notice-dismissed', 'true');
    }
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-4 right-4 max-w-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg shadow-lg z-50 transition-all duration-300',
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      className
    )}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Development Mode
            </h3>
            <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              <p className="mb-2">
                Using mock data. To use real data:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Setup MongoDB (local or Atlas)</li>
                <li>Run <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">npm run db:init</code></li>
                <li>Restart the application</li>
              </ol>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="/database-setup"
                className="inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-800 text-xs text-amber-800 dark:text-amber-200 rounded hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors"
              >
                <Database className="h-3 w-3 mr-1" />
                Setup Database
              </a>
              <a
                href="/atlas-helper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-xs text-green-800 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
              >
                Find Atlas Info
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <a
                href="/docs/DATABASE_SETUP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
              >
                Setup Guide
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
