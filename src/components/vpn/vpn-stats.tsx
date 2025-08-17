'use client';

import React from 'react';
import { cn, formatNumber, formatBytes } from '@/utils';
import {
  Shield,
  Users,
  Network,
  Clock,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
}

function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn('p-3 rounded-lg', colorClasses[color])}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className="text-right">
            <div className="flex items-center space-x-1">
              {trend.direction === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {trend.direction === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
              <span className={cn(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {trend.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function VpnStats() {
  const stats = [
    {
      title: 'Active Tunnels',
      value: 24,
      subtitle: '18 site-to-site, 6 remote',
      icon: <Network className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: 8,
        direction: 'up' as const,
        label: 'new this month',
      },
    },
    {
      title: 'Connected Users',
      value: 156,
      subtitle: 'Remote access users',
      icon: <Users className="h-6 w-6" />,
      color: 'blue' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
        label: 'vs last week',
      },
    },
    {
      title: 'Total Throughput',
      value: formatBytes(2.4 * 1024 * 1024 * 1024), // 2.4 GB
      subtitle: 'Last 24 hours',
      icon: <Activity className="h-6 w-6" />,
      color: 'purple' as const,
      trend: {
        value: 18,
        direction: 'up' as const,
        label: 'increased usage',
      },
    },
    {
      title: 'Uptime',
      value: '99.8%',
      subtitle: 'Service availability',
      icon: <Shield className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: 0.2,
        direction: 'up' as const,
        label: 'improved',
      },
    },
    {
      title: 'Avg Connection Time',
      value: '4.2h',
      subtitle: 'Per session',
      icon: <Clock className="h-6 w-6" />,
      color: 'indigo' as const,
      trend: {
        value: -8,
        direction: 'down' as const,
        label: 'shorter sessions',
      },
    },
    {
      title: 'Failed Connections',
      value: 12,
      subtitle: 'Last 24 hours',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'red' as const,
      trend: {
        value: -25,
        direction: 'down' as const,
        label: 'fewer failures',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
