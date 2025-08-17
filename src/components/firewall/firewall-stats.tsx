'use client';

import React from 'react';
import { cn, formatNumber } from '@/utils';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Clock,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    gray: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
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
            <div className={cn(
              'text-sm font-medium',
              trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
              trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            )}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              vs last week
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FirewallStats() {
  const stats = [
    {
      title: 'Total Rules',
      value: 247,
      subtitle: 'Active policies',
      icon: <Shield className="h-6 w-6" />,
      color: 'blue' as const,
      trend: {
        value: 5,
        direction: 'up' as const,
      },
    },
    {
      title: 'Enabled Rules',
      value: 198,
      subtitle: '80.2% of total',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: 2,
        direction: 'up' as const,
      },
    },
    {
      title: 'Disabled Rules',
      value: 49,
      subtitle: '19.8% of total',
      icon: <XCircle className="h-6 w-6" />,
      color: 'gray' as const,
      trend: {
        value: -3,
        direction: 'down' as const,
      },
    },
    {
      title: 'Rules with Alerts',
      value: 12,
      subtitle: 'Need attention',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'yellow' as const,
      trend: {
        value: 0,
        direction: 'neutral' as const,
      },
    },
    {
      title: 'Traffic Processed',
      value: '2.4TB',
      subtitle: 'Last 24 hours',
      icon: <Activity className="h-6 w-6" />,
      color: 'purple' as const,
      trend: {
        value: 15,
        direction: 'up' as const,
      },
    },
    {
      title: 'Avg Response Time',
      value: '0.8ms',
      subtitle: 'Rule processing',
      icon: <Clock className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: -12,
        direction: 'down' as const,
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
