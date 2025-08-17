'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatBytes, formatNumber } from '@/utils';
import {
  Globe,
  MessageSquare,
  Play,
  Code,
  Shield,
  Monitor,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface Application {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  vendor: string;
  status: 'allowed' | 'blocked' | 'monitored' | 'restricted';
  risk: 'low' | 'medium' | 'high' | 'critical';
  users: number;
  bandwidth: number;
  sessions: number;
  lastSeen: Date;
  icon: React.ReactNode;
}

interface ApplicationsListProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

// Sample applications data
const sampleApplications: Application[] = [
  {
    id: '1',
    name: 'Google Chrome',
    category: 'productivity',
    description: 'Web browser for internet browsing',
    version: '118.0.5993.88',
    vendor: 'Google LLC',
    status: 'allowed',
    risk: 'low',
    users: 245,
    bandwidth: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
    sessions: 892,
    lastSeen: new Date(),
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: '2',
    name: 'Microsoft Teams',
    category: 'productivity',
    description: 'Collaboration and communication platform',
    version: '1.6.00.4472',
    vendor: 'Microsoft Corporation',
    status: 'allowed',
    risk: 'low',
    users: 189,
    bandwidth: 850 * 1024 * 1024, // 850 MB
    sessions: 456,
    lastSeen: new Date(),
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: '3',
    name: 'TikTok',
    category: 'social',
    description: 'Social media video sharing platform',
    version: '27.8.3',
    vendor: 'ByteDance Ltd.',
    status: 'blocked',
    risk: 'high',
    users: 67,
    bandwidth: 2.1 * 1024 * 1024 * 1024, // 2.1 GB
    sessions: 234,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    icon: <Play className="h-5 w-5" />,
  },
  {
    id: '4',
    name: 'Visual Studio Code',
    category: 'development',
    description: 'Source code editor',
    version: '1.84.2',
    vendor: 'Microsoft Corporation',
    status: 'allowed',
    risk: 'low',
    users: 123,
    bandwidth: 450 * 1024 * 1024, // 450 MB
    sessions: 178,
    lastSeen: new Date(),
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: '5',
    name: 'Tor Browser',
    category: 'security',
    description: 'Anonymous web browser',
    version: '12.5.6',
    vendor: 'The Tor Project',
    status: 'monitored',
    risk: 'critical',
    users: 12,
    bandwidth: 156 * 1024 * 1024, // 156 MB
    sessions: 23,
    lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: '6',
    name: 'Zoom',
    category: 'productivity',
    description: 'Video conferencing application',
    version: '5.16.10',
    vendor: 'Zoom Video Communications',
    status: 'restricted',
    risk: 'medium',
    users: 98,
    bandwidth: 1.8 * 1024 * 1024 * 1024, // 1.8 GB
    sessions: 145,
    lastSeen: new Date(),
    icon: <Monitor className="h-5 w-5" />,
  },
];

export function ApplicationsList({ searchQuery, categoryFilter, statusFilter }: ApplicationsListProps) {
  const [sortField, setSortField] = useState<keyof Application>('users');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    let filtered = sampleApplications.filter(app => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.vendor.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(app => {
      // Category filter
      if (categoryFilter !== 'all' && app.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) {
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
  }, [searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Application) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof Application; children: React.ReactNode }) => (
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'monitored':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'restricted':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity':
        return <Monitor className="h-4 w-4" />;
      case 'social':
        return <MessageSquare className="h-4 w-4" />;
      case 'entertainment':
        return <Play className="h-4 w-4" />;
      case 'development':
        return <Code className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="name">Application</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Risk Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="users">Users</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="bandwidth">Bandwidth</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <SortButton field="sessions">Sessions</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Seen
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredApplications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {app.icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {app.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      v{app.version} • {app.vendor}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(app.category)}
                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                    {app.category}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  getStatusColor(app.status)
                )}>
                  {app.status === 'allowed' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {app.status === 'blocked' && <XCircle className="h-3 w-3 mr-1" />}
                  {app.status === 'monitored' && <Eye className="h-3 w-3 mr-1" />}
                  {app.status === 'restricted' && <Ban className="h-3 w-3 mr-1" />}
                  {app.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  getRiskColor(app.risk)
                )}>
                  {app.risk.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatNumber(app.users)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {formatBytes(app.bandwidth)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {formatNumber(app.sessions)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {app.lastSeen.toLocaleTimeString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === app.id ? null : app.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  
                  {showDropdown === app.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                          <Shield className="h-4 w-4 mr-2" />
                          Edit Policy
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                          <Ban className="h-4 w-4 mr-2" />
                          Block Application
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

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No applications found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
