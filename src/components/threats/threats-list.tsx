'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn, formatDate, getSeverityColor } from '@/utils';
import type { ThreatEvent } from '@/types';
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';

interface ThreatsListProps {
  threats?: ThreatEvent[];
  isLive?: boolean;
  refreshInterval?: number;
  searchQuery: string;
  severityFilter: string;
  typeFilter: string;
  loading?: boolean;
}

// Sample threat data generator (same as in dashboard)
const generateThreatEvent = (): ThreatEvent => {
  const types: ThreatEvent['type'][] = ['malware', 'intrusion', 'botnet', 'phishing', 'vulnerability', 'spam'];
  const severities: ThreatEvent['severity'][] = ['critical', 'high', 'medium', 'low', 'info'];
  const actions = ['blocked', 'quarantined', 'logged', 'alerted'];
  
  const sourceIps = [
    '192.168.1.100', '10.0.0.45', '172.16.0.23', '203.0.113.15',
    '198.51.100.42', '192.0.2.88', '203.0.113.195', '198.51.100.178'
  ];
  
  const destinations = [
    '10.0.0.1', '192.168.1.1', '172.16.0.1', '8.8.8.8',
    '1.1.1.1', '208.67.222.222', '9.9.9.9'
  ];

  const signatures = [
    'Trojan.Win32.Generic',
    'SQL Injection Attempt',
    'Botnet C&C Communication',
    'Phishing Email Detected',
    'Buffer Overflow Attempt',
    'Suspicious File Download',
    'Port Scan Detected',
    'Malicious JavaScript',
    'Ransomware Activity',
    'DDoS Attack Pattern',
    'Credential Stuffing',
    'Cross-Site Scripting',
    'Command Injection',
    'Privilege Escalation',
    'Data Exfiltration'
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const signature = signatures[Math.floor(Math.random() * signatures.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const blocked = action === 'blocked' || action === 'quarantined';

  return {
    id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
    type,
    severity,
    source: sourceIps[Math.floor(Math.random() * sourceIps.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    description: `${signature} detected from ${sourceIps[Math.floor(Math.random() * sourceIps.length)]}`,
    signature,
    action,
    blocked,
    details: {
      protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
      port: Math.floor(Math.random() * 65535) + 1,
      size: Math.floor(Math.random() * 1024 * 1024), // Up to 1MB
      country: ['US', 'CN', 'RU', 'BR', 'IN', 'DE', 'FR', 'UK'][Math.floor(Math.random() * 8)],
    },
  };
};

export function ThreatsList({
  threats = [],
  isLive = false,
  refreshInterval = 5000,
  searchQuery,
  severityFilter,
  typeFilter,
  loading = false
}: ThreatsListProps) {
  const [sortField, setSortField] = useState<keyof ThreatEvent>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);



  const filteredThreats = useMemo(() => {
    let filtered = threats.filter(threat => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          threat.source.includes(query) ||
          threat.destination.includes(query) ||
          threat.signature.toLowerCase().includes(query) ||
          threat.description.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(threat => {
      // Severity filter
      if (severityFilter !== 'all' && threat.severity !== severityFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && threat.type !== typeFilter) {
        return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [threats, searchQuery, severityFilter, typeFilter, sortField, sortDirection]);

  const handleSort = (field: keyof ThreatEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof ThreatEvent; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
    >
      <span>{children}</span>
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );

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

  const threatStats = {
    total: filteredThreats.length,
    blocked: filteredThreats.filter(t => t.blocked).length,
    critical: filteredThreats.filter(t => t.severity === 'critical').length,
    high: filteredThreats.filter(t => t.severity === 'high').length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Threat Events
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredThreats.length} of {threats.length} threats
            </p>
          </div>
        </div>

        {isLive && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Live - Updates every {refreshInterval}s
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {threatStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {threatStats.blocked}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Blocked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {threatStats.critical}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {threatStats.high}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="timestamp">Time</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="severity">Severity</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="type">Type</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Threat Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredThreats.slice(0, 25).map((threat) => (
              <tr key={threat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(threat.timestamp, 'MMM dd, HH:mm:ss')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getSeverityColor(threat.severity)
                  )}>
                    {threat.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getTypeColor(threat.type)
                  )}>
                    {threat.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {threat.signature}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {threat.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {threat.source}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {threat.destination}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {threat.blocked ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      threat.blocked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {threat.blocked ? 'BLOCKED' : 'DETECTED'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === threat.id ? null : threat.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {showDropdown === threat.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                            <Ban className="h-4 w-4 mr-2" />
                            Block Source IP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">25</span> of{' '}
            <span className="font-medium">{filteredThreats.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Previous
            </button>
            <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
