'use client';

import React from 'react';
import { cn, formatNumber, formatBytes } from '@/utils';
import {
  Shield,
  AlertTriangle,
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

function OverviewCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  className,
}: OverviewCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
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
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={cn('text-sm font-medium', getTrendColor())}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {trend.label}
          </p>
        </div>
      )}
    </div>
  );
}

interface OverviewCardsProps {
  data?: {
    threatsBlocked?: number;
    activeConnections?: number;
    criticalAlerts?: number;
    connectedUsers?: number;
    trends?: {
      threatsBlocked?: { value: number; direction: 'up' | 'down' | 'neutral' };
      activeConnections?: { value: number; direction: 'up' | 'down' | 'neutral' };
      criticalAlerts?: { value: number; direction: 'up' | 'down' | 'neutral' };
      connectedUsers?: { value: number; direction: 'up' | 'down' | 'neutral' };
    };
  };
  loading?: boolean;
}

export function OverviewCards({ data, loading = false }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Threats Blocked',
      value: data?.threatsBlocked ?? 0,
      subtitle: 'Last 24 hours',
      icon: <Shield className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: data?.trends?.threatsBlocked?.value ?? 0,
        direction: data?.trends?.threatsBlocked?.direction ?? 'neutral' as const,
        label: 'vs. previous 24h',
      },
    },
    {
      title: 'Active Connections',
      value: data?.activeConnections ?? 0,
      subtitle: 'Current sessions',
      icon: <Activity className="h-6 w-6" />,
      color: 'blue' as const,
      trend: {
        value: data?.trends?.activeConnections?.value ?? 0,
        direction: data?.trends?.activeConnections?.direction ?? 'neutral' as const,
        label: 'vs. average',
      },
    },
    {
      title: 'Critical Alerts',
      value: data?.criticalAlerts ?? 0,
      subtitle: 'Requires attention',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'red' as const,
      trend: {
        value: data?.trends?.criticalAlerts?.value ?? 0,
        direction: data?.trends?.criticalAlerts?.direction ?? 'neutral' as const,
        label: 'No change',
      },
    },
    {
      title: 'Connected Users',
      value: data?.connectedUsers ?? 0,
      subtitle: 'Authenticated users',
      icon: <Users className="h-6 w-6" />,
      color: 'purple' as const,
      trend: {
        value: data?.trends?.connectedUsers?.value ?? 0,
        direction: data?.trends?.connectedUsers?.direction ?? 'neutral' as const,
        label: 'vs. yesterday',
      },
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <OverviewCard key={index} {...card} />
      ))}
    </div>
  );
}

// Additional cards for bandwidth and system metrics
interface SystemMetricsCardsProps {
  data?: {
    bandwidthUsage?: number;
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
    trends?: {
      bandwidth?: { value: number; direction: 'up' | 'down' | 'neutral' };
      cpu?: { value: number; direction: 'up' | 'down' | 'neutral' };
      memory?: { value: number; direction: 'up' | 'down' | 'neutral' };
      disk?: { value: number; direction: 'up' | 'down' | 'neutral' };
    };
  };
  loading?: boolean;
}

export function SystemMetricsCards({ data, loading = false }: SystemMetricsCardsProps) {
  const systemCards = [
    {
      title: 'Bandwidth Usage',
      value: data?.bandwidthUsage ? formatBytes(data.bandwidthUsage) : formatBytes(1.2 * 1024 * 1024 * 1024),
      subtitle: 'Current throughput',
      icon: <Activity className="h-6 w-6" />,
      color: 'blue' as const,
      trend: {
        value: data?.trends?.bandwidth?.value ?? 15,
        direction: data?.trends?.bandwidth?.direction ?? 'up' as const,
        label: 'vs. last hour',
      },
    },
    {
      title: 'CPU Usage',
      value: data?.cpuUsage ? `${data.cpuUsage}%` : '23%',
      subtitle: 'System load',
      icon: <Activity className="h-6 w-6" />,
      color: 'green' as const,
      trend: {
        value: data?.trends?.cpu?.value ?? -2,
        direction: data?.trends?.cpu?.direction ?? 'down' as const,
        label: 'Optimized',
      },
    },
    {
      title: 'Memory Usage',
      value: data?.memoryUsage ? `${data.memoryUsage}%` : '67%',
      subtitle: data?.memoryUsage ? 'RAM utilization' : '5.4 GB / 8 GB',
      icon: <Activity className="h-6 w-6" />,
      color: 'yellow' as const,
      trend: {
        value: data?.trends?.memory?.value ?? 3,
        direction: data?.trends?.memory?.direction ?? 'up' as const,
        label: 'Normal range',
      },
    },
    {
      title: 'Disk Usage',
      value: data?.diskUsage ? `${data.diskUsage}%` : '45%',
      subtitle: 'Storage capacity',
      icon: <Activity className="h-6 w-6" />,
      color: 'purple' as const,
      trend: {
        value: data?.trends?.disk?.value ?? 1,
        direction: data?.trends?.disk?.direction ?? 'up' as const,
        label: 'Stable',
      },
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {systemCards.map((card, index) => (
        <OverviewCard key={index} {...card} />
      ))}
    </div>
  );
}
