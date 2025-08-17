'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { cn, formatBytes } from '@/utils';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Server,
} from 'lucide-react';

interface BandwidthAnalyticsProps {
  isLive: boolean;
}

interface ApplicationData {
  name: string;
  bandwidth: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  category: string;
}

interface DeviceTypeData {
  name: string;
  value: number;
  color: string;
}

export function BandwidthAnalytics({ isLive }: BandwidthAnalyticsProps) {
  const [applicationData, setApplicationData] = useState<ApplicationData[]>([
    {
      name: 'Web Browsing',
      bandwidth: 450 * 1024 * 1024, // 450 MB
      percentage: 35,
      color: '#3b82f6',
      icon: <Globe className="h-4 w-4" />,
      category: 'Web',
    },
    {
      name: 'Video Streaming',
      bandwidth: 320 * 1024 * 1024, // 320 MB
      percentage: 25,
      color: '#ef4444',
      icon: <Monitor className="h-4 w-4" />,
      category: 'Media',
    },
    {
      name: 'File Transfer',
      bandwidth: 256 * 1024 * 1024, // 256 MB
      percentage: 20,
      color: '#10b981',
      icon: <Server className="h-4 w-4" />,
      category: 'Transfer',
    },
    {
      name: 'Mobile Apps',
      bandwidth: 128 * 1024 * 1024, // 128 MB
      percentage: 10,
      color: '#f59e0b',
      icon: <Smartphone className="h-4 w-4" />,
      category: 'Mobile',
    },
    {
      name: 'Other',
      bandwidth: 128 * 1024 * 1024, // 128 MB
      percentage: 10,
      color: '#8b5cf6',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'Other',
    },
  ]);

  const [deviceTypeData, setDeviceTypeData] = useState<DeviceTypeData[]>([
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 30, color: '#10b981' },
    { name: 'Tablet', value: 15, color: '#f59e0b' },
    { name: 'IoT', value: 10, color: '#8b5cf6' },
  ]);

  const [topUsers, setTopUsers] = useState([
    { name: 'John Doe', bandwidth: 2.1 * 1024 * 1024 * 1024, department: 'Engineering' },
    { name: 'Jane Smith', bandwidth: 1.8 * 1024 * 1024 * 1024, department: 'Marketing' },
    { name: 'Mike Johnson', bandwidth: 1.5 * 1024 * 1024 * 1024, department: 'Sales' },
    { name: 'Sarah Wilson', bandwidth: 1.2 * 1024 * 1024 * 1024, department: 'Design' },
    { name: 'Tom Brown', bandwidth: 0.9 * 1024 * 1024 * 1024, department: 'HR' },
  ]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setApplicationData(prevData =>
        prevData.map(app => ({
          ...app,
          bandwidth: Math.max(
            app.bandwidth * 0.5,
            app.bandwidth + (Math.random() - 0.5) * app.bandwidth * 0.1
          ),
        }))
      );

      setTopUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          bandwidth: Math.max(
            user.bandwidth * 0.5,
            user.bandwidth + (Math.random() - 0.5) * user.bandwidth * 0.05
          ),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const totalBandwidth = applicationData.reduce((sum, app) => sum + app.bandwidth, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatBytes(data.bandwidth)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Application Bandwidth Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bandwidth by Application
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatBytes(totalBandwidth)} total
              </p>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={applicationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
              >
                {applicationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Application List */}
        <div className="space-y-3">
          {applicationData.map((app, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn('p-2 rounded-lg')} style={{ backgroundColor: `${app.color}20`, color: app.color }}>
                  {app.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {app.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatBytes(app.bandwidth)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {app.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Types */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device Types
        </h3>
        
        <div className="space-y-3">
          {deviceTypeData.map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: device.color }}
                ></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {device.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${device.value}%`,
                      backgroundColor: device.color 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {device.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Bandwidth Users
          </h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.department}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatBytes(user.bandwidth)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  #{index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
