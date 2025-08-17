'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn, formatBytes, formatDuration, getStatusColor } from '@/utils';
import type { NetworkConnection } from '@/types';
import {
  Wifi,
  Search,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Ban,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface ActiveConnectionsProps {
  connections?: NetworkConnection[];
  isLive?: boolean;
  refreshInterval?: number;
  loading?: boolean;
}



export function ActiveConnections({
  connections = [],
  isLive = false,
  refreshInterval = 5000,
  loading = false
}: ActiveConnectionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof NetworkConnection>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setConnections(prevConnections => {
        // Simulate some connections closing and new ones opening
        const updatedConnections = prevConnections.map(conn => {
          if (Math.random() < 0.05) { // 5% chance to change status
            const statuses: NetworkConnection['status'][] = ['active', 'closed', 'timeout'];
            return {
              ...conn,
              status: statuses[Math.floor(Math.random() * statuses.length)],
              bytesIn: conn.bytesIn + Math.floor(Math.random() * 1024 * 100),
              bytesOut: conn.bytesOut + Math.floor(Math.random() * 1024 * 50),
              duration: conn.duration + refreshInterval,
            };
          }
          return {
            ...conn,
            bytesIn: conn.status === 'active' ? conn.bytesIn + Math.floor(Math.random() * 1024 * 10) : conn.bytesIn,
            bytesOut: conn.status === 'active' ? conn.bytesOut + Math.floor(Math.random() * 1024 * 5) : conn.bytesOut,
            duration: conn.status === 'active' ? conn.duration + refreshInterval : conn.duration,
          };
        });

        // Occasionally add new connections
        if (Math.random() < 0.1) { // 10% chance to add new connection
          const newConnections = generateSampleConnections().slice(0, Math.floor(Math.random() * 3) + 1);
          return [...updatedConnections, ...newConnections].slice(-100); // Keep only last 100
        }

        return updatedConnections;
      });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const filteredConnections = useMemo(() => {
    let filtered = connections.filter(conn => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          conn.sourceIp.includes(query) ||
          conn.destinationIp.includes(query) ||
          conn.application?.toLowerCase().includes(query) ||
          conn.user?.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(conn => {
      // Status filter
      if (statusFilter !== 'all' && conn.status !== statusFilter) {
        return false;
      }
      // Protocol filter
      if (protocolFilter !== 'all' && conn.protocol !== protocolFilter) {
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
  }, [connections, searchQuery, statusFilter, protocolFilter, sortField, sortDirection]);

  const handleSort = (field: keyof NetworkConnection) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof NetworkConnection; children: React.ReactNode }) => (
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

  const connectionStats = {
    total: connections.length,
    active: connections.filter(c => c.status === 'active').length,
    closed: connections.filter(c => c.status === 'closed').length,
    blocked: connections.filter(c => c.status === 'blocked').length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
            <Wifi className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Connections
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredConnections.length} of {connections.length} connections
            </p>
          </div>
        </div>

        {isLive && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
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
            {connectionStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {connectionStats.active}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {connectionStats.closed}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Closed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {connectionStats.blocked}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Blocked</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by IP, application, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="timeout">Timeout</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
          </select>
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
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Protocol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="bytesIn">Data Transfer</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="duration">Duration</SortButton>
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
            {filteredConnections.slice(0, 20).map((connection) => (
              <tr key={connection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {connection.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900 dark:text-white">
                    {connection.sourceIp}:{connection.sourcePort}
                  </div>
                  {connection.user && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {connection.user}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                  {connection.destinationIp}:{connection.destinationPort}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {connection.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {connection.application}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="text-xs">
                    ↓ {formatBytes(connection.bytesIn)}
                  </div>
                  <div className="text-xs">
                    ↑ {formatBytes(connection.bytesOut)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDuration(connection.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(connection.status)
                  )}>
                    {connection.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === connection.id ? null : connection.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {showDropdown === connection.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                            <Ban className="h-4 w-4 mr-2" />
                            Block Connection
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
            <span className="font-medium">{filteredConnections.length}</span> results
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
