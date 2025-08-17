'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';
import {
  Shield,
  Ban,
  FileText,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  Download,
  Settings,
  Lock,
  Globe,
  Users,
} from 'lucide-react';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  onClick: () => void;
  disabled?: boolean;
}

function QuickAction({ 
  icon, 
  title, 
  description, 
  color, 
  onClick, 
  disabled = false 
}: QuickActionProps) {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    red: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    gray: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-lg border transition-all duration-200 text-left group',
        colorClasses[color],
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:shadow-md transform hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">
            {title}
          </h3>
          <p className="text-xs opacity-75 mt-1">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export function QuickActionsPanel() {
  const [showBlockIPModal, setShowBlockIPModal] = useState(false);

  const quickActions = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Create Firewall Rule',
      description: 'Add new security rule',
      color: 'blue' as const,
      onClick: () => {
        // Navigate to firewall rules page
        window.location.href = '/firewall/new';
      },
    },
    {
      icon: <Ban className="h-5 w-5" />,
      title: 'Block IP Address',
      description: 'Quickly block suspicious IP',
      color: 'red' as const,
      onClick: () => setShowBlockIPModal(true),
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'View Threat Logs',
      description: 'Check recent security events',
      color: 'yellow' as const,
      onClick: () => {
        window.location.href = '/threats';
      },
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: 'Network Monitor',
      description: 'Real-time traffic analysis',
      color: 'green' as const,
      onClick: () => {
        window.location.href = '/network';
      },
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Generate Report',
      description: 'Create security report',
      color: 'purple' as const,
      onClick: () => {
        window.location.href = '/reports/new';
      },
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: 'Export Logs',
      description: 'Download system logs',
      color: 'gray' as const,
      onClick: () => {
        // Trigger log export
        console.log('Exporting logs...');
      },
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'VPN Status',
      description: 'Check VPN connections',
      color: 'blue' as const,
      onClick: () => {
        window.location.href = '/vpn';
      },
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Web Filter',
      description: 'Manage content filtering',
      color: 'green' as const,
      onClick: () => {
        window.location.href = '/web-filter';
      },
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'User Management',
      description: 'Manage user accounts',
      color: 'purple' as const,
      onClick: () => {
        window.location.href = '/users';
      },
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Customize
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Block IP Modal */}
      {showBlockIPModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowBlockIPModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Block IP Address
                    </h3>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IP Address to Block
                      </label>
                      <input
                        type="text"
                        placeholder="192.168.1.100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">
                        Reason (Optional)
                      </label>
                      <textarea
                        placeholder="Suspicious activity detected..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Handle block IP logic here
                    setShowBlockIPModal(false);
                  }}
                >
                  Block IP
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowBlockIPModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
