'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatDate, formatNumber } from '@/utils';
import {
  Globe,
  Ban,
  Eye,
  Clock,
  Users,
  MoreHorizontal,
  Trash2,
  Edit,
  Play,
  Pause,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Shield,
} from 'lucide-react';

interface BlockedSite {
  id: string;
  url: string;
  category: string;
  reason: string;
  status: 'blocked' | 'monitored' | 'allowed';
  attempts: number;
  lastAttempt: Date;
  users: number;
  addedBy: string;
  addedAt: Date;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

interface BlockedSitesProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

// Sample blocked sites data
const sampleBlockedSites: BlockedSite[] = [
  {
    id: '1',
    url: 'facebook.com',
    category: 'social',
    reason: 'Social media blocked during work hours',
    status: 'blocked',
    attempts: 1247,
    lastAttempt: new Date(),
    users: 89,
    addedBy: 'admin',
    addedAt: new Date('2024-01-15'),
    risk: 'medium',
  },
  {
    id: '2',
    url: 'malicious-site.com',
    category: 'malware',
    reason: 'Known malware distribution site',
    status: 'blocked',
    attempts: 23,
    lastAttempt: new Date(Date.now() - 3600000),
    users: 5,
    addedBy: 'security-team',
    addedAt: new Date('2024-01-10'),
    risk: 'critical',
  },
  {
    id: '3',
    url: 'youtube.com',
    category: 'entertainment',
    reason: 'Video streaming monitoring',
    status: 'monitored',
    attempts: 3456,
    lastAttempt: new Date(),
    users: 156,
    addedBy: 'it-admin',
    addedAt: new Date('2024-01-08'),
    risk: 'low',
  },
  {
    id: '4',
    url: 'gambling-site.com',
    category: 'gambling',
    reason: 'Gambling content prohibited',
    status: 'blocked',
    attempts: 67,
    lastAttempt: new Date(Date.now() - 7200000),
    users: 12,
    addedBy: 'admin',
    addedAt: new Date('2024-01-05'),
    risk: 'high',
  },
  {
    id: '5',
    url: 'phishing-example.com',
    category: 'phishing',
    reason: 'Phishing attempt detected',
    status: 'blocked',
    attempts: 145,
    lastAttempt: new Date(Date.now() - 1800000),
    users: 8,
    addedBy: 'security-team',
    addedAt: new Date('2024-01-12'),
    risk: 'critical',
  },
  {
    id: '6',
    url: 'twitter.com',
    category: 'social',
    reason: 'Social media policy',
    status: 'blocked',
    attempts: 892,
    lastAttempt: new Date(),
    users: 67,
    addedBy: 'admin',
    addedAt: new Date('2024-01-15'),
    risk: 'medium',
  },
  {
    id: '7',
    url: 'news-site.com',
    category: 'news',
    reason: 'Productivity monitoring',
    status: 'monitored',
    attempts: 234,
    lastAttempt: new Date(),
    users: 45,
    addedBy: 'it-admin',
    addedAt: new Date('2024-01-07'),
    risk: 'low',
  },
  {
    id: '8',
    url: 'adult-content.com',
    category: 'adult',
    reason: 'Adult content blocked',
    status: 'blocked',
    attempts: 456,
    lastAttempt: new Date(Date.now() - 5400000),
    users: 23,
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    risk: 'high',
  },
];

export function BlockedSites({ searchQuery, categoryFilter, statusFilter }: BlockedSitesProps) {
  const [sortField, setSortField] = useState<keyof BlockedSite>('attempts');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredSites = useMemo(() => {
    let filtered = sampleBlockedSites.filter(site => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          site.url.toLowerCase().includes(query) ||
          site.reason.toLowerCase().includes(query) ||
          site.category.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(site => {
      // Category filter
      if (categoryFilter !== 'all' && site.category !== categoryFilter) {
        return false;
      }
      // Status filter (map statusFilter to site.status)
      if (statusFilter !== 'all') {
        const statusMap = {
          'enabled': 'blocked',
          'disabled': 'allowed',
          'monitor': 'monitored',
        };
        const mappedStatus = statusMap[statusFilter as keyof typeof statusMap];
        if (mappedStatus && site.status !== mappedStatus) {
          return false;
        }
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

  const handleSort = (field: keyof BlockedSite) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof BlockedSite; children: React.ReactNode }) => (
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
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'monitored':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'allowed':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked':
        return <Ban className="h-3 w-3" />;
      case 'monitored':
        return <Eye className="h-3 w-3" />;
      case 'allowed':
        return <Shield className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const siteStats = {
    total: filteredSites.length,
    blocked: filteredSites.filter(s => s.status === 'blocked').length,
    monitored: filteredSites.filter(s => s.status === 'monitored').length,
    critical: filteredSites.filter(s => s.risk === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {siteStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Sites</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {siteStats.blocked}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Blocked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {siteStats.monitored}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Monitored</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {siteStats.critical}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Critical Risk</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="url">Website</SortButton>
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
                <SortButton field="attempts">Attempts</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="users">Users</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="lastAttempt">Last Attempt</SortButton>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {site.url}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {site.reason}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                    {site.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusColor(site.status)
                  )}>
                    {getStatusIcon(site.status)}
                    <span className="ml-1">{site.status.toUpperCase()}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getRiskColor(site.risk)
                  )}>
                    {site.risk === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {site.risk.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(site.attempts)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatNumber(site.users)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(site.lastAttempt, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === site.id ? null : site.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {showDropdown === site.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Rule
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            {site.status === 'blocked' ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                            {site.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
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

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No blocked sites found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
