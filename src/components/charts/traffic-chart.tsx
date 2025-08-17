'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatBytes } from '@/utils';

interface TrafficChartProps {
  data?: Array<{
    time: string;
    inbound: number;
    outbound: number;
  }>;
  height?: number;
  showGrid?: boolean;
}

// Sample data for demonstration
const sampleData = [
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
];

export function TrafficChart({ 
  data = sampleData, 
  height = 300, 
  showGrid = true 
}: TrafficChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Inbound: {formatBytes(payload[0].value * 1024 * 1024)}/s
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Outbound: {formatBytes(payload[1].value * 1024 * 1024)}/s
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-700" 
            />
          )}
          <XAxis 
            dataKey="time" 
            className="text-xs fill-gray-500 dark:fill-gray-400"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs fill-gray-500 dark:fill-gray-400"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}MB/s`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="inbound"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="outbound"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function NetworkUtilizationChart({
  height = 200,
  data,
  isLive = false
}: {
  height?: number;
  data?: Array<{ time: string; utilization: number; }>;
  isLive?: boolean;
}) {
  const utilizationData = data || [
    { time: '00:00', utilization: 45 },
    { time: '04:00', utilization: 32 },
    { time: '08:00', utilization: 68 },
    { time: '12:00', utilization: 85 },
    { time: '16:00', utilization: 92 },
    { time: '20:00', utilization: 76 },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={utilizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="time"
            className="text-xs fill-gray-500 dark:fill-gray-400"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            className="text-xs fill-gray-500 dark:fill-gray-400"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [`${value}%`, 'Utilization']}
          />
          <Area
            type="monotone"
            dataKey="utilization"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ThreatTrendChart({ height = 200 }: { height?: number }) {
  const threatData = [
    { time: '00:00', threats: 12 },
    { time: '04:00', threats: 8 },
    { time: '08:00', threats: 15 },
    { time: '12:00', threats: 23 },
    { time: '16:00', threats: 18 },
    { time: '20:00', threats: 14 },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={threatData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="time" 
            className="text-xs fill-gray-500 dark:fill-gray-400"
            axisLine={false}
            tickLine={false}
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
          <Line
            type="monotone"
            dataKey="threats"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
