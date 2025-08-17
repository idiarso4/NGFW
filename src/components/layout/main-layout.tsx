'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { DevNotice } from '@/components/ui/dev-notice';
import { NoSSR } from '@/components/ui/no-ssr';
import { useUIStore } from '@/store';
import { cn } from '@/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>

      {/* Development Notice */}
      {process.env.NODE_ENV === 'development' && (
        <NoSSR>
          <DevNotice />
        </NoSSR>
      )}
    </div>
  );
}
