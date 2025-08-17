'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { FirewallRulesTable } from '@/components/firewall/firewall-rules-table';
import { FirewallRuleForm } from '@/components/firewall/firewall-rule-form';
import { FirewallStats } from '@/components/firewall/firewall-stats';
import { BulkOperations } from '@/components/firewall/bulk-operations';
import { 
  Shield, 
  Plus, 
  Download, 
  Upload, 
  Settings,
  Filter,
  Search
} from 'lucide-react';

export default function FirewallPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirewallData();
  }, []);

  const fetchFirewallData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/firewall/rules');
      const data = await response.json();

      if (data.success) {
        setRules(data.data.rules);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching firewall data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = (action: string, ruleIds: string[]) => {
    console.log(`Bulk action: ${action} on rules:`, ruleIds);
    // Implement bulk action logic here
    setSelectedRules([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Firewall Rules
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage network security rules and policies
              </p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <FirewallStats />

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-elegant">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search rules by name, source, destination..."
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
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Rules</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                  <option value="allow">Allow Rules</option>
                  <option value="deny">Deny Rules</option>
                  <option value="drop">Drop Rules</option>
                </select>
              </div>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        <BulkOperations
          selectedRules={selectedRules}
          onClearSelection={() => setSelectedRules([])}
          onBulkAction={handleBulkAction}
        />

        {/* Firewall Rules Table */}
        <FirewallRulesTable
          rules={rules}
          searchQuery={searchQuery}
          filter={selectedFilter}
          selectedRules={selectedRules}
          onSelectionChange={setSelectedRules}
          loading={loading}
        />

        {/* Firewall Statistics */}
        <FirewallStats stats={stats} loading={loading} />

        {/* Create Rule Modal */}
        {showCreateForm && (
          <FirewallRuleForm
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onSave={(rule) => {
              console.log('New rule:', rule);
              setShowCreateForm(false);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
