'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatNumber } from '@/utils';
import {
  AlertTriangle,
  Shield,
  Bug,
  Zap,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface ThreatStatsProps {
  isLive: boolean;
}

interface StatData {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  status?: 'normal' | 'warning' | 'critical';
}

function StatCard({ title, value, subtitle, icon, color, trend, status }: StatData) {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const statusIndicator = status && (
    <div className="absolute top-2 right-2">
      {status === 'normal' && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {status === 'critical' && <XCircle className="h-4 w-4 text-red-500" />}
    </div>
  );

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-200">
      {statusIndicator}
      
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
              {trend.direction === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
              {trend.direction === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
              <span className={cn(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-red-600 dark:text-red-400' :
                trend.direction === 'down' ? 'text-green-600 dark:text-green-400' :
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

export function ThreatStats({ isLive }: ThreatStatsProps) {
  const [stats, setStats] = useState<StatData[]>([
    {
      title: 'Threats Detected',
      value: 1247,
      subtitle: 'Last 24 hours',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'red',
      trend: {
        value: 12,
        direction: 'up',
        label: 'vs yesterday',
      },
      status: 'warning',
    },
    {
      title: 'Threats Blocked',
      value: 1198,
      subtitle: '96.1% success rate',
      icon: <Shield className="h-6 w-6" />,
      color: 'green',
      trend: {
        value: 8,
        direction: 'up',
        label: 'effectiveness',
      },
      status: 'normal',
    },
    {
      title: 'Critical Threats',
      value: 23,
      subtitle: 'Requires attention',
      icon: <Zap className="h-6 w-6" />,
      color: 'red',
      trend: {
        value: -15,
        direction: 'down',
        label: 'reduced',
      },
      status: 'critical',
    },
    {
      title: 'Malware Detected',
      value: 89,
      subtitle: 'Active infections',
      icon: <Bug className="h-6 w-6" />,
      color: 'orange',
      trend: {
        value: 5,
        direction: 'up',
        label: 'new today',
      },
      status: 'warning',
    },
    {
      title: 'IPS Events',
      value: 456,
      subtitle: 'Intrusion attempts',
      icon: <Eye className="h-6 w-6" />,
      color: 'yellow',
      trend: {
        value: -8,
        direction: 'down',
        label: 'vs last week',
      },
      status: 'normal',
    },
    {
      title: 'Avg Response Time',
      value: '0.3s',
      subtitle: 'Detection speed',
      icon: <Clock className="h-6 w-6" />,
      color: 'blue',
      trend: {
        value: -12,
        direction: 'down',
        label: 'improved',
      },
      status: 'normal',
    },
  ]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          // Simulate real-time data updates
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          
          switch (stat.title) {
            case 'Threats Detected':
              const currentThreats = typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString());
              const newThreats = Math.max(1000, Math.floor(currentThreats + (Math.random() * 10)));
              return {
                ...stat,
                value: newThreats,
                status: newThreats > 1500 ? 'critical' : newThreats > 1200 ? 'warning' : 'normal',
              };
              
            case 'Threats Blocked':
              const currentBlocked = typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString());
              const newBlocked = Math.max(900, Math.floor(currentBlocked + (Math.random() * 8)));
              const successRate = ((newBlocked / (newBlocked + 50)) * 100).toFixed(1);
              return {
                ...stat,
                value: newBlocked,
                subtitle: `${successRate}% success rate`,
                status: parseFloat(successRate) > 95 ? 'normal' : parseFloat(successRate) > 90 ? 'warning' : 'critical',
              };
              
            case 'Critical Threats':
              const currentCritical = typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString());
              const newCritical = Math.max(0, Math.floor(currentCritical + (Math.random() - 0.7) * 5));
              return {
                ...stat,
                value: newCritical,
                status: newCritical > 50 ? 'critical' : newCritical > 20 ? 'warning' : 'normal',
              };
              
            case 'Malware Detected':
              const currentMalware = typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString());
              const newMalware = Math.max(0, Math.floor(currentMalware + (Math.random() - 0.6) * 3));
              return {
                ...stat,
                value: newMalware,
                status: newMalware > 100 ? 'critical' : newMalware > 50 ? 'warning' : 'normal',
              };
              
            default:
              return stat;
          }
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
