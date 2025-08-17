'use client';

import React, { useState, useEffect } from 'react';
import { TrafficChart, NetworkUtilizationChart } from '@/components/charts/traffic-chart';
import { cn, formatBytes } from '@/utils';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Download,
  Upload,
} from 'lucide-react';

interface TrafficMonitorProps {
  isLive: boolean;
  refreshInterval: number;
}

interface TrafficData {
  time: string;
  inbound: number;
  outbound: number;
}

export function TrafficMonitor({ isLive, refreshInterval }: TrafficMonitorProps) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    { time: '00:00', inbound: 45, outbound: 32 },
    { time: '02:00', inbound: 52, outbound: 38 },
    { time: '04:00', inbound: 48, outbound: 35 },
    { time: '06:00', inbound: 61, outbound: 42 },
    { time: '08:00', inbound: 78, outbound: 55 },
    { time: '10:00', inbound: 95, outbound: 68 },
    { time: '12:00', inbound: 112, outbound: 82 },
    { time: '14:00', inbound: 108, outbound: 79 },
    { time: '16:00', inbound: 125, outbound: 91 },
    { time: '18:00', inbound: 142, outbound: 105 },
    { time: '20:00', inbound: 138, outbound: 98 },
    { time: '22:00', inbound: 115, outbound: 85 },
  ]);

  const [currentStats, setCurrentStats] = useState({
    totalInbound: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
    totalOutbound: 0.8 * 1024 * 1024 * 1024, // 0.8 GB
    peakInbound: 142,
    peakOutbound: 105,
    avgInbound: 89,
    avgOutbound: 64,
  });

  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setTrafficData(prevData => {
        const newData = [...prevData];
        const lastEntry = newData[newData.length - 1];
        
        // Generate new data point with some randomness
        const variation = 0.1; // 10% variation
        const newInbound = Math.max(10, lastEntry.inbound + (Math.random() - 0.5) * lastEntry.inbound * variation);
        const newOutbound = Math.max(5, lastEntry.outbound + (Math.random() - 0.5) * lastEntry.outbound * variation);
        
        newData.push({
          time: timeStr,
          inbound: Math.round(newInbound),
          outbound: Math.round(newOutbound),
        });

        // Keep only last 24 data points
        return newData.slice(-24);
      });

      // Update current stats
      setCurrentStats(prev => ({
        ...prev,
        totalInbound: prev.totalInbound + Math.random() * 1024 * 1024 * 10, // Add ~10MB
        totalOutbound: prev.totalOutbound + Math.random() * 1024 * 1024 * 5,  // Add ~5MB
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const latestData = trafficData[trafficData.length - 1];
  const previousData = trafficData[trafficData.length - 2];
  
  const inboundTrend = previousData ? 
    ((latestData.inbound - previousData.inbound) / previousData.inbound * 100) : 0;
  const outboundTrend = previousData ? 
    ((latestData.outbound - previousData.outbound) / previousData.outbound * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Network Traffic Monitor
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time bandwidth usage and trends
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>

          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Download className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Inbound</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatBytes(latestData.inbound * 1024 * 1024)}/s
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {inboundTrend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              'text-xs font-medium',
              inboundTrend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {Math.abs(inboundTrend).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Upload className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Outbound</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatBytes(latestData.outbound * 1024 * 1024)}/s
          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {outboundTrend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              'text-xs font-medium',
              outboundTrend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {Math.abs(outboundTrend).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Inbound
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatBytes(currentStats.totalInbound)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Peak: {currentStats.peakInbound} MB/s
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Outbound
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatBytes(currentStats.totalOutbound)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Peak: {currentStats.peakOutbound} MB/s
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="p-6">
        <TrafficChart 
          data={trafficData}
          height={300}
          showGrid={true}
        />
      </div>

      {/* Live Indicator */}
      {isLive && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live monitoring - Updates every {refreshInterval}s</span>
          </div>
        </div>
      )}
    </div>
  );
}
