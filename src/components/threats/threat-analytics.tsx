'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { cn } from '@/utils';
import {
  BarChart3,
  Globe,
  Bug,
  Shield,
  AlertTriangle,
  Zap,
  Eye,
  Mail,
} from 'lucide-react';

interface ThreatAnalyticsProps {
  isLive: boolean;
}

interface ThreatTypeData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface SeverityData {
  name: string;
  value: number;
  color: string;
}

interface TopSourceData {
  ip: string;
  country: string;
  threats: number;
  blocked: number;
}

export function ThreatAnalytics({ isLive }: ThreatAnalyticsProps) {
  const [threatTypeData, setThreatTypeData] = useState<ThreatTypeData[]>([
    {
      name: 'Malware',
      value: 35,
      color: '#ef4444',
      icon: <Bug className="h-4 w-4" />,
    },
    {
      name: 'Intrusion',
      value: 25,
      color: '#f97316',
      icon: <Shield className="h-4 w-4" />,
    },
    {
      name: 'Phishing',
      value: 20,
      color: '#eab308',
      icon: <Mail className="h-4 w-4" />,
    },
    {
      name: 'Botnet',
      value: 12,
      color: '#8b5cf6',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: 'Vulnerability',
      value: 5,
      color: '#3b82f6',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      name: 'Spam',
      value: 3,
      color: '#6b7280',
      icon: <Eye className="h-4 w-4" />,
    },
  ]);

  const [severityData, setSeverityData] = useState<SeverityData[]>([
    { name: 'Critical', value: 15, color: '#dc2626' },
    { name: 'High', value: 28, color: '#ea580c' },
    { name: 'Medium', value: 35, color: '#ca8a04' },
    { name: 'Low', value: 18, color: '#2563eb' },
    { name: 'Info', value: 4, color: '#6b7280' },
  ]);

  const [topSources, setTopSources] = useState<TopSourceData[]>([
    { ip: '203.0.113.15', country: 'Unknown', threats: 89, blocked: 85 },
    { ip: '198.51.100.42', country: 'Russia', threats: 67, blocked: 64 },
    { ip: '192.0.2.88', country: 'China', threats: 54, blocked: 52 },
    { ip: '203.0.113.195', country: 'Brazil', threats: 43, blocked: 41 },
    { ip: '198.51.100.178', country: 'India', threats: 38, blocked: 36 },
  ]);

  const [attackVectors, setAttackVectors] = useState([
    { name: 'Web Application', value: 45 },
    { name: 'Email', value: 28 },
    { name: 'Network', value: 15 },
    { name: 'USB/Removable', value: 8 },
    { name: 'Social Engineering', value: 4 },
  ]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate real-time updates with small variations
      setThreatTypeData(prevData =>
        prevData.map(item => ({
          ...item,
          value: Math.max(1, item.value + (Math.random() - 0.5) * 2),
        }))
      );

      setSeverityData(prevData =>
        prevData.map(item => ({
          ...item,
          value: Math.max(1, item.value + (Math.random() - 0.5) * 3),
        }))
      );

      setTopSources(prevData =>
        prevData.map(item => ({
          ...item,
          threats: Math.max(10, item.threats + Math.floor((Math.random() - 0.7) * 5)),
          blocked: Math.max(8, item.blocked + Math.floor((Math.random() - 0.7) * 5)),
        }))
      );
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value}% of total threats
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Threat Types Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Threat Types
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Distribution by category
              </p>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={threatTypeData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {threatTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Types List */}
        <div className="space-y-2">
          {threatTypeData.map((threat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn('p-1.5 rounded')} style={{ backgroundColor: `${threat.color}20`, color: threat.color }}>
                  {threat.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {threat.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${threat.value}%`,
                      backgroundColor: threat.color 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {Math.round(threat.value)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Severity Levels
        </h3>
        
        <div className="space-y-3">
          {severityData.map((severity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: severity.color }}
                ></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {severity.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${(severity.value / 100) * 100}%`,
                      backgroundColor: severity.color 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {severity.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Threat Sources */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Threat Sources
        </h3>
        
        <div className="space-y-3">
          {topSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.ip}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {source.country}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {source.threats} threats
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {source.blocked} blocked
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Vectors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attack Vectors
        </h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attackVectors} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                className="text-xs fill-gray-500 dark:fill-gray-400"
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs fill-gray-500 dark:fill-gray-400"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
