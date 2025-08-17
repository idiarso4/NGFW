'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatNumber } from '@/utils';
import {
  Shield,
  Ban,
  Eye,
  AlertTriangle,
  Globe,
  MessageSquare,
  Play,
  DollarSign,
  Heart,
  Bug,
  Mail,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  MoreHorizontal,
  Settings,
  BarChart3,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface FilterCategory {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'enabled' | 'disabled' | 'monitor';
  action: 'block' | 'allow' | 'monitor';
  sites: number;
  blocked: number;
  monitored: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
  color: string;
}

interface FilterCategoriesProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

// Sample filter categories data
const sampleCategories: FilterCategory[] = [
  {
    id: '1',
    name: 'Social Media',
    description: 'Social networking and media sharing platforms',
    category: 'social',
    status: 'enabled',
    action: 'block',
    sites: 1247,
    blocked: 892,
    monitored: 355,
    risk: 'medium',
    icon: <MessageSquare className="h-5 w-5" />,
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Entertainment',
    description: 'Video streaming, gaming, and entertainment sites',
    category: 'entertainment',
    status: 'enabled',
    action: 'monitor',
    sites: 2156,
    blocked: 0,
    monitored: 2156,
    risk: 'low',
    icon: <Play className="h-5 w-5" />,
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Gambling',
    description: 'Online gambling and betting websites',
    category: 'gambling',
    status: 'enabled',
    action: 'block',
    sites: 567,
    blocked: 567,
    monitored: 0,
    risk: 'high',
    icon: <DollarSign className="h-5 w-5" />,
    color: '#f59e0b',
  },
  {
    id: '4',
    name: 'Adult Content',
    description: 'Adult and mature content websites',
    category: 'adult',
    status: 'enabled',
    action: 'block',
    sites: 3421,
    blocked: 3421,
    monitored: 0,
    risk: 'critical',
    icon: <Heart className="h-5 w-5" />,
    color: '#ef4444',
  },
  {
    id: '5',
    name: 'Malware & Phishing',
    description: 'Known malicious and phishing websites',
    category: 'malware',
    status: 'enabled',
    action: 'block',
    sites: 12456,
    blocked: 12456,
    monitored: 0,
    risk: 'critical',
    icon: <Bug className="h-5 w-5" />,
    color: '#dc2626',
  },
  {
    id: '6',
    name: 'Email & Webmail',
    description: 'Web-based email services',
    category: 'communication',
    status: 'disabled',
    action: 'allow',
    sites: 234,
    blocked: 0,
    monitored: 0,
    risk: 'low',
    icon: <Mail className="h-5 w-5" />,
    color: '#6b7280',
  },
  {
    id: '7',
    name: 'Shopping',
    description: 'E-commerce and online shopping sites',
    category: 'shopping',
    status: 'enabled',
    action: 'monitor',
    sites: 1876,
    blocked: 0,
    monitored: 1876,
    risk: 'low',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: '#8b5cf6',
  },
  {
    id: '8',
    name: 'Business & Finance',
    description: 'Business and financial services websites',
    category: 'business',
    status: 'enabled',
    action: 'allow',
    sites: 987,
    blocked: 0,
    monitored: 987,
    risk: 'low',
    icon: <Briefcase className="h-5 w-5" />,
    color: '#059669',
  },
  {
    id: '9',
    name: 'Education',
    description: 'Educational and academic websites',
    category: 'education',
    status: 'enabled',
    action: 'allow',
    sites: 2341,
    blocked: 0,
    monitored: 2341,
    risk: 'low',
    icon: <GraduationCap className="h-5 w-5" />,
    color: '#0ea5e9',
  },
];

export function FilterCategories({ searchQuery, categoryFilter, statusFilter }: FilterCategoriesProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return sampleCategories.filter(category => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(category => {
      // Category filter
      if (categoryFilter !== 'all' && category.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && category.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'disabled':
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
      case 'monitor':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'allow':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'monitor':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCategories.map((category) => (
        <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(showDropdown === category.id ? null : category.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showDropdown === category.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Stats
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                      {category.status === 'enabled' ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                      {category.status === 'enabled' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Action */}
          <div className="flex items-center space-x-2 mb-4">
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getStatusColor(category.status)
            )}>
              {category.status === 'enabled' && <Shield className="h-3 w-3 mr-1" />}
              {category.status === 'disabled' && <Ban className="h-3 w-3 mr-1" />}
              {category.status === 'monitor' && <Eye className="h-3 w-3 mr-1" />}
              {category.status.toUpperCase()}
            </span>
            
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getActionColor(category.action)
            )}>
              {category.action.toUpperCase()}
            </span>
            
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getRiskColor(category.risk)
            )}>
              {category.risk === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
              {category.risk.toUpperCase()}
            </span>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(category.sites)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Sites
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatNumber(category.blocked)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Blocked
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {formatNumber(category.monitored)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monitored
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Block Rate</span>
              <span>{category.sites > 0 ? Math.round((category.blocked / category.sites) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${category.sites > 0 ? (category.blocked / category.sites) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      {filteredCategories.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No categories found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
