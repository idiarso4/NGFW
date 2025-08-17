'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatDate } from '@/utils';
import {
  Shield,
  Users,
  Clock,
  Globe,
  Ban,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Settings,
} from 'lucide-react';

interface FilterPolicy {
  id: string;
  name: string;
  description: string;
  action: 'allow' | 'block' | 'monitor';
  scope: 'global' | 'group' | 'user';
  target: string;
  categories: string[];
  schedule?: {
    type: 'always' | 'business_hours' | 'custom';
    details?: string;
  };
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  appliedTo: number;
}

interface FilterPoliciesProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

// Sample filter policies data
const samplePolicies: FilterPolicy[] = [
  {
    id: '1',
    name: 'Block Social Media',
    description: 'Block access to social media sites during business hours',
    action: 'block',
    scope: 'global',
    target: 'All Users',
    categories: ['Social Media', 'Entertainment'],
    schedule: {
      type: 'business_hours',
      details: 'Monday-Friday, 9:00 AM - 5:00 PM',
    },
    enabled: true,
    priority: 100,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin',
    appliedTo: 245,
  },
  {
    id: '2',
    name: 'Allow Business Sites',
    description: 'Allow access to business and productivity websites',
    action: 'allow',
    scope: 'global',
    target: 'All Users',
    categories: ['Business & Finance', 'Education', 'Productivity'],
    schedule: {
      type: 'always',
    },
    enabled: true,
    priority: 95,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'it-admin',
    appliedTo: 245,
  },
  {
    id: '3',
    name: 'Monitor File Sharing',
    description: 'Monitor file sharing and cloud storage access',
    action: 'monitor',
    scope: 'global',
    target: 'All Users',
    categories: ['File Sharing', 'Cloud Storage'],
    schedule: {
      type: 'always',
    },
    enabled: true,
    priority: 80,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    createdBy: 'security-team',
    appliedTo: 245,
  },
  {
    id: '4',
    name: 'Executive Bypass',
    description: 'Allow unrestricted access for executive team',
    action: 'allow',
    scope: 'group',
    target: 'Executive Team',
    categories: ['All Categories'],
    schedule: {
      type: 'always',
    },
    enabled: true,
    priority: 99,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-06'),
    createdBy: 'admin',
    appliedTo: 12,
  },
  {
    id: '5',
    name: 'Block Malicious Content',
    description: 'Block known malicious and phishing websites',
    action: 'block',
    scope: 'global',
    target: 'All Users',
    categories: ['Malware & Phishing', 'Suspicious Sites'],
    schedule: {
      type: 'always',
    },
    enabled: true,
    priority: 98,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-04'),
    createdBy: 'security-team',
    appliedTo: 245,
  },
  {
    id: '6',
    name: 'Restrict Gambling',
    description: 'Block gambling and betting websites',
    action: 'block',
    scope: 'global',
    target: 'All Users',
    categories: ['Gambling', 'Online Betting'],
    schedule: {
      type: 'always',
    },
    enabled: true,
    priority: 90,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    createdBy: 'admin',
    appliedTo: 245,
  },
];

export function FilterPolicies({ searchQuery, categoryFilter, statusFilter }: FilterPoliciesProps) {
  const [sortField, setSortField] = useState<keyof FilterPolicy>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredPolicies = useMemo(() => {
    let filtered = samplePolicies.filter(policy => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          policy.name.toLowerCase().includes(query) ||
          policy.description.toLowerCase().includes(query) ||
          policy.target.toLowerCase().includes(query) ||
          policy.categories.some(cat => cat.toLowerCase().includes(query))
        );
      }
      return true;
    }).filter(policy => {
      // Status filter (map to enabled/disabled)
      if (statusFilter !== 'all') {
        if (statusFilter === 'enabled' && !policy.enabled) return false;
        if (statusFilter === 'disabled' && policy.enabled) return false;
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
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof FilterPolicy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof FilterPolicy; children: React.ReactNode }) => (
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'block':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'monitor':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global':
        return <Globe className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'allow':
        return <CheckCircle className="h-3 w-3" />;
      case 'block':
        return <XCircle className="h-3 w-3" />;
      case 'monitor':
        return <Eye className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const policyStats = {
    total: filteredPolicies.length,
    enabled: filteredPolicies.filter(p => p.enabled).length,
    disabled: filteredPolicies.filter(p => !p.enabled).length,
    global: filteredPolicies.filter(p => p.scope === 'global').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {policyStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Policies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {policyStats.enabled}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Enabled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {policyStats.disabled}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Disabled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {policyStats.global}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Global</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="priority">Priority</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="name">Policy Name</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="appliedTo">Applied To</SortButton>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPolicies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={cn(
                      'h-2 w-2 rounded-full mr-2',
                      policy.enabled ? 'bg-green-500' : 'bg-gray-400'
                    )}></div>
                    <span className={cn(
                      'text-sm font-medium',
                      policy.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {policy.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {policy.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {policy.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {policy.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getActionColor(policy.action)
                  )}>
                    {getActionIcon(policy.action)}
                    <span className="ml-1">{policy.action.toUpperCase()}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getScopeIcon(policy.scope)}
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {policy.scope}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {policy.target}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {policy.categories.length === 1 && policy.categories[0] === 'All Categories' 
                      ? 'All Categories'
                      : `${policy.categories.slice(0, 2).join(', ')}${policy.categories.length > 2 ? ` +${policy.categories.length - 2} more` : ''}`
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="text-sm text-gray-900 dark:text-white">
                      {policy.schedule?.type === 'always' ? 'Always' :
                       policy.schedule?.type === 'business_hours' ? 'Business Hours' :
                       'Custom'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {policy.appliedTo} users
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === policy.id ? null : policy.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {showDropdown === policy.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Policy
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            {policy.enabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {policy.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Policy
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

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No policies found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
