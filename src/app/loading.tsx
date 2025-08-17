import React from 'react';
import { AppIcon } from '@/components/ui/app-icon';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse">
            <AppIcon size="xl" />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loading NGFW Dashboard
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Initializing security management interface...
        </p>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
