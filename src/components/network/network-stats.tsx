'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatBytes, formatNumber } from '@/utils';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Wifi,
  Server,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface NetworkStatsProps {
  isLive: boolean;
}

interface StatData {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  status?: 'normal' | 'warning' | 'critical';
}

function StatCard({ title, value, subtitle, icon, color, trend, status }: StatData) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  const statusIndicator = status && (
    <div className="absolute top-2 right-2">
      {status === 'normal' && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
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
              {value}
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

export function NetworkStats({ isLive }: NetworkStatsProps) {
  const [stats, setStats] = useState<StatData[]>([
    {
      title: 'Total Bandwidth',
      value: '1.2 Gbps',
      subtitle: 'Current throughput',
      icon: <Activity className="h-6 w-6" />,
      color: 'blue',
      trend: {
        value: 15,
        direction: 'up',
        label: 'vs last hour',
      },
      status: 'normal',
    },
    {
      title: 'Active Connections',
      value: '2,847',
      subtitle: 'Current sessions',
      icon: <Wifi className="h-6 w-6" />,
      color: 'green',
      trend: {
        value: -3,
        direction: 'down',
        label: 'vs average',
      },
      status: 'normal',
    },
    {
      title: 'Connected Devices',
      value: '156',
      subtitle: 'Online devices',
      icon: <Server className="h-6 w-6" />,
      color: 'purple',
      trend: {
        value: 8,
        direction: 'up',
        label: 'new today',
      },
      status: 'normal',
    },
    {
      title: 'Active Users',
      value: '89',
      subtitle: 'Authenticated users',
      icon: <Users className="h-6 w-6" />,
      color: 'indigo',
      trend: {
        value: 12,
        direction: 'up',
        label: 'vs yesterday',
      },
      status: 'normal',
    },
    {
      title: 'Network Latency',
      value: '12ms',
      subtitle: 'Average response time',
      icon: <Clock className="h-6 w-6" />,
      color: 'yellow',
      trend: {
        value: -8,
        direction: 'down',
        label: 'improved',
      },
      status: 'normal',
    },
    {
      title: 'Packet Loss',
      value: '0.02%',
      subtitle: 'Quality indicator',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'green',
      trend: {
        value: 0,
        direction: 'neutral',
        label: 'stable',
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
            case 'Total Bandwidth':
              const currentBandwidth = parseFloat(stat.value.replace(' Gbps', ''));
              const newBandwidth = Math.max(0.1, currentBandwidth + variation);
              return {
                ...stat,
                value: `${newBandwidth.toFixed(1)} Gbps`,
                status: newBandwidth > 1.5 ? 'warning' : 'normal',
              };
              
            case 'Active Connections':
              const currentConnections = parseInt(stat.value.replace(',', ''));
              const newConnections = Math.max(1000, Math.floor(currentConnections + (variation * 100)));
              return {
                ...stat,
                value: formatNumber(newConnections),
                status: newConnections > 3000 ? 'warning' : 'normal',
              };
              
            case 'Network Latency':
              const currentLatency = parseInt(stat.value.replace('ms', ''));
              const newLatency = Math.max(1, Math.floor(currentLatency + (variation * 5)));
              return {
                ...stat,
                value: `${newLatency}ms`,
                status: newLatency > 50 ? 'critical' : newLatency > 25 ? 'warning' : 'normal',
              };
              
            case 'Packet Loss':
              const currentLoss = parseFloat(stat.value.replace('%', ''));
              const newLoss = Math.max(0, currentLoss + (variation * 0.01));
              return {
                ...stat,
                value: `${newLoss.toFixed(2)}%`,
                status: newLoss > 1 ? 'critical' : newLoss > 0.5 ? 'warning' : 'normal',
              };
              
            default:
              return stat;
          }
        })
      );
    }, 2000); // Update every 2 seconds

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
