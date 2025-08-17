'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import { useUIStore } from '@/store';
import { AppIcon } from '@/components/ui/app-icon';
import {
  Shield,
  BarChart3,
  Network,
  AlertTriangle,
  Settings,
  Users,
  FileText,
  Activity,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Overview and statistics',
  },
  {
    name: 'Firewall Rules',
    href: '/firewall',
    icon: Shield,
    description: 'Manage firewall rules',
  },
  {
    name: 'Network Monitor',
    href: '/network',
    icon: Network,
    description: 'Real-time network monitoring',
  },
  {
    name: 'Threat Detection',
    href: '/threats',
    icon: AlertTriangle,
    description: 'Security threats and alerts',
  },
  {
    name: 'Application Control',
    href: '/applications',
    icon: Activity,
    description: 'Application access control',
  },
  {
    name: 'Web Filtering',
    href: '/web-filter',
    icon: Globe,
    description: 'Web content filtering',
  },
  {
    name: 'VPN Management',
    href: '/vpn',
    icon: Lock,
    description: 'VPN tunnels and access',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Security and traffic reports',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Advanced analytics',
  },
  {
    name: 'User Management',
    href: '/users',
    icon: Users,
    description: 'User accounts and roles',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
  },
  {
    name: 'Database Setup',
    href: '/database-setup',
    icon: Database,
    description: 'Configure database connection',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <AppIcon size="md" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                NGFW
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Dashboard
              </span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                sidebarCollapsed ? 'justify-center' : 'justify-start'
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
                  !sidebarCollapsed && 'mr-3'
                )}
              />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                System Online
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All services running
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
