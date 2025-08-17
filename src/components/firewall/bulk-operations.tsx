'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';
import {
  Play,
  Pause,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';

interface BulkOperationsProps {
  selectedRules: string[];
  onClearSelection: () => void;
  onBulkAction: (action: string, ruleIds: string[]) => void;
}

export function BulkOperations({ 
  selectedRules, 
  onClearSelection, 
  onBulkAction 
}: BulkOperationsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    action: string;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: string;
  } | null>(null);

  const handleBulkAction = (action: string) => {
    const actionConfigs = {
      enable: {
        title: 'Enable Rules',
        message: `Are you sure you want to enable ${selectedRules.length} selected rule${selectedRules.length > 1 ? 's' : ''}?`,
        confirmText: 'Enable Rules',
        confirmColor: 'green',
      },
      disable: {
        title: 'Disable Rules',
        message: `Are you sure you want to disable ${selectedRules.length} selected rule${selectedRules.length > 1 ? 's' : ''}?`,
        confirmText: 'Disable Rules',
        confirmColor: 'yellow',
      },
      delete: {
        title: 'Delete Rules',
        message: `Are you sure you want to permanently delete ${selectedRules.length} selected rule${selectedRules.length > 1 ? 's' : ''}? This action cannot be undone.`,
        confirmText: 'Delete Rules',
        confirmColor: 'red',
      },
      duplicate: {
        title: 'Duplicate Rules',
        message: `This will create ${selectedRules.length} new rule${selectedRules.length > 1 ? 's' : ''} based on the selected rule${selectedRules.length > 1 ? 's' : ''}.`,
        confirmText: 'Duplicate Rules',
        confirmColor: 'blue',
      },
    };

    const config = actionConfigs[action as keyof typeof actionConfigs];
    if (config) {
      setShowConfirmDialog({
        action,
        ...config,
      });
    } else {
      // For actions that don't need confirmation
      onBulkAction(action, selectedRules);
    }
  };

  const confirmAction = () => {
    if (showConfirmDialog) {
      onBulkAction(showConfirmDialog.action, selectedRules);
      setShowConfirmDialog(null);
    }
  };

  const getConfirmButtonColor = (color: string) => {
    const colors = {
      green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (selectedRules.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {selectedRules.length} rule{selectedRules.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Enable/Disable Actions */}
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-md border border-primary-200 dark:border-primary-700">
              <button
                onClick={() => handleBulkAction('enable')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-l-md transition-colors"
                title="Enable selected rules"
              >
                <Play className="h-4 w-4 mr-1" />
                Enable
              </button>
              <div className="w-px h-6 bg-primary-200 dark:bg-primary-700"></div>
              <button
                onClick={() => handleBulkAction('disable')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-r-md transition-colors"
                title="Disable selected rules"
              >
                <Pause className="h-4 w-4 mr-1" />
                Disable
              </button>
            </div>

            {/* Other Actions */}
            <button
              onClick={() => handleBulkAction('duplicate')}
              className="inline-flex items-center px-3 py-2 border border-primary-300 dark:border-primary-700 text-sm font-medium rounded-md text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              title="Duplicate selected rules"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </button>

            <button
              onClick={() => handleBulkAction('export')}
              className="inline-flex items-center px-3 py-2 border border-primary-300 dark:border-primary-700 text-sm font-medium rounded-md text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              title="Export selected rules"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>

            <button
              onClick={() => handleBulkAction('move')}
              className="inline-flex items-center px-3 py-2 border border-primary-300 dark:border-primary-700 text-sm font-medium rounded-md text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              title="Move selected rules"
            >
              <Settings className="h-4 w-4 mr-1" />
              Move
            </button>

            {/* Delete Action */}
            <button
              onClick={() => handleBulkAction('delete')}
              className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete selected rules"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-700">
          <div className="flex items-center space-x-6 text-sm text-primary-600 dark:text-primary-400">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Enabled: 0</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span>Disabled: 0</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Allow: 0</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>Deny/Drop: 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowConfirmDialog(null)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={cn(
                    'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                    showConfirmDialog.confirmColor === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                    showConfirmDialog.confirmColor === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    showConfirmDialog.confirmColor === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  )}>
                    {showConfirmDialog.action === 'delete' ? (
                      <AlertTriangle className={cn(
                        'h-6 w-6',
                        showConfirmDialog.confirmColor === 'red' ? 'text-red-600 dark:text-red-400' : 'text-gray-600'
                      )} />
                    ) : showConfirmDialog.action === 'enable' ? (
                      <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : showConfirmDialog.action === 'disable' ? (
                      <Pause className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <Copy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {showConfirmDialog.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {showConfirmDialog.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmAction}
                  className={cn(
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                    getConfirmButtonColor(showConfirmDialog.confirmColor)
                  )}
                >
                  {showConfirmDialog.confirmText}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
