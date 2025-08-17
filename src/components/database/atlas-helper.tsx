'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle, AlertCircle, Database, Cloud, Search } from 'lucide-react';
import { cn } from '@/utils';

interface AtlasHelperProps {
  className?: string;
}

export function AtlasHelper({ className }: AtlasHelperProps) {
  const [connectionString, setConnectionString] = useState('');
  const [parsedInfo, setParsedInfo] = useState<{
    username?: string;
    cluster?: string;
    database?: string;
    isValid: boolean;
  }>({ isValid: false });
  const [copied, setCopied] = useState(false);

  const parseConnectionString = (connStr: string) => {
    try {
      // Parse MongoDB Atlas connection string
      // Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?options
      const regex = /mongodb\+srv:\/\/([^:]+):([^@]+)@([^.]+)\.([^\/]+)\/([^?]*)/;
      const match = connStr.match(regex);
      
      if (match) {
        const [, username, , clusterName, , database] = match;
        setParsedInfo({
          username,
          cluster: clusterName,
          database: database || 'ngfw_dashboard_cloud',
          isValid: true
        });
      } else {
        setParsedInfo({ isValid: false });
      }
    } catch (error) {
      setParsedInfo({ isValid: false });
    }
  };

  const handleConnectionStringChange = (value: string) => {
    setConnectionString(value);
    parseConnectionString(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleConnectionStrings = [
    {
      name: 'Standard Format',
      example: 'mongodb+srv://username:password@cluster0.abc123.mongodb.net/ngfw_dashboard?retryWrites=true&w=majority'
    },
    {
      name: 'With Custom Cluster',
      example: 'mongodb+srv://myuser:mypass@mycluster.xyz789.mongodb.net/firewall_db?retryWrites=true&w=majority'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          MongoDB Atlas Helper
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find your cluster name and database name from your Atlas connection string
        </p>
      </div>

      {/* Connection String Parser */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔍 Parse Your Connection String
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste your MongoDB Atlas connection string:
            </label>
            <textarea
              value={connectionString}
              onChange={(e) => handleConnectionStringChange(e.target.value)}
              placeholder="mongodb+srv://username:password@cluster0.abc123.mongodb.net/database?retryWrites=true&w=majority"
              className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm font-mono"
            />
          </div>

          {connectionString && (
            <div className="mt-4">
              {parsedInfo.isValid ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                      ✅ Connection String Parsed Successfully!
                    </h4>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Username
                      </label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 dark:text-white">
                          {parsedInfo.username}
                        </code>
                        <button
                          onClick={() => copyToClipboard(parsedInfo.username || '')}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Cluster Name
                      </label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 dark:text-white">
                          {parsedInfo.cluster}
                        </code>
                        <button
                          onClick={() => copyToClipboard(parsedInfo.cluster || '')}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Database Name
                      </label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 dark:text-white">
                          {parsedInfo.database}
                        </code>
                        <button
                          onClick={() => copyToClipboard(parsedInfo.database || '')}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {copied && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                      ✅ Copied to clipboard!
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Invalid Connection String Format
                    </h4>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Please check your connection string format. It should start with "mongodb+srv://"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sample Connection Strings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📝 Sample Connection String Formats
        </h3>
        
        <div className="space-y-3">
          {sampleConnectionStrings.map((sample, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {sample.name}
                </h4>
                <button
                  onClick={() => handleConnectionStringChange(sample.example)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                >
                  Try This
                </button>
              </div>
              <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                {sample.example}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📚 Step-by-Step Guide
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Go to MongoDB Atlas Dashboard
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visit <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">cloud.mongodb.com</a> and login to your account
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Find Your Cluster
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                In your project dashboard, look for the "Clusters" section. Your cluster name will be displayed there (e.g., "Cluster0")
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Get Connection String
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click "Connect" → "Connect your application" → Select "Node.js" → Copy the connection string
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Parse Information
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Paste your connection string above to automatically extract username, cluster name, and database name
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="https://cloud.mongodb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Cloud className="h-4 w-4 mr-2" />
          Open Atlas Dashboard
          <ExternalLink className="h-3 w-3 ml-2" />
        </a>
        
        <a
          href="/database-setup"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Database className="h-4 w-4 mr-2" />
          Back to Database Setup
        </a>
      </div>
    </div>
  );
}
