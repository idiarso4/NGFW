'use client';

import React, { useState, useEffect } from 'react';
import { ThreatTrendChart } from '@/components/charts/traffic-chart';
import { cn, formatDate, getSeverityColor } from '@/utils';
import type { ThreatEvent } from '@/types';
import {
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  Activity,
  Zap,
} from 'lucide-react';

interface ThreatDashboardProps {
  threats?: ThreatEvent[];
  isLive?: boolean;
  refreshInterval?: number;
  loading?: boolean;
}



export function ThreatDashboard({
  threats = [],
  isLive = false,
  refreshInterval = 5000,
  loading = false
}: ThreatDashboardProps) {
  const [threatTrendData, setThreatTrendData] = useState([
    { time: '00:00', threats: 12 },
    { time: '04:00', threats: 8 },
    { time: '08:00', threats: 15 },
    { time: '12:00', threats: 23 },
    { time: '16:00', threats: 18 },
    { time: '20:00', threats: 14 },
  ]);

  // Use threats from props
  const recentThreats = threats.slice(0, 10); // Show only recent 10 threats

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Update trend data
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      setThreatTrendData(prev => {
        const newData = [...prev];
        const lastValue = newData[newData.length - 1]?.threats || 10;
        const newValue = Math.max(0, lastValue + (Math.random() - 0.5) * 8);

        newData.push({
          time: timeStr,
          threats: Math.round(newValue),
        });

        return newData.slice(-12); // Keep last 12 data points
      });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Zap className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      malware: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800',
      intrusion: 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800',
      botnet: 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800',
      phishing: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800',
      vulnerability: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800',
      spam: 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700',
    };
    return colors[type as keyof typeof colors] || colors.spam;
  };

  return (
    <div className="space-y-6">
      {/* Threat Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Threat Detection Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time threat detection over time
              </p>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
            </div>
          )}
        </div>

        <ThreatTrendChart height={250} />
      </div>

      {/* Recent Threats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Threats
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest security events and alerts
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {recentThreats.length} events
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {recentThreats.slice(0, 10).map((threat) => (
            <div key={threat.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(threat.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {threat.signature}
                      </p>
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
                        getSeverityColor(threat.severity)
                      )}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
                        getTypeColor(threat.type)
                      )}>
                        {threat.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {threat.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>From: {threat.source}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>To: {threat.destination}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(threat.timestamp, 'HH:mm:ss')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    threat.blocked 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  )}>
                    {threat.blocked ? 'BLOCKED' : 'DETECTED'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentThreats.length === 0 && (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No recent threats detected</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Your network is secure
            </p>
          </div>
        )}

        {isLive && recentThreats.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>Live threat monitoring - Updates every {refreshInterval}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
