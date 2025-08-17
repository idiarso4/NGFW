'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Clock, ArrowRight, Copy, Eye, EyeOff } from 'lucide-react';

interface MongoDBAtlasGuideProps {
  onConfigComplete?: (config: { uri: string; dbName: string }) => void;
}

export function MongoDBAtlasGuide({ onConfigComplete }: MongoDBAtlasGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    username: '',
    password: '',
    cluster: '',
    dbName: 'ngfw_dashboard_cloud'
  });
  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Create MongoDB Atlas Account',
      description: 'Sign up for a free MongoDB Atlas account',
      completed: false
    },
    {
      id: 2,
      title: 'Create New Project',
      description: 'Create a project for your NGFW Dashboard',
      completed: false
    },
    {
      id: 3,
      title: 'Build Database Cluster',
      description: 'Create a free M0 Sandbox cluster',
      completed: false
    },
    {
      id: 4,
      title: 'Create Database User',
      description: 'Set up authentication credentials',
      completed: false
    },
    {
      id: 5,
      title: 'Configure Network Access',
      description: 'Allow connections from your IP',
      completed: false
    },
    {
      id: 6,
      title: 'Get Connection String',
      description: 'Copy your connection details',
      completed: false
    }
  ];

  const generateConnectionString = () => {
    if (config.username && config.password && config.cluster) {
      return `mongodb+srv://${config.username}:${config.password}@${config.cluster}.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;
    }
    return '';
  };

  const handleComplete = () => {
    const uri = generateConnectionString();
    if (uri && onConfigComplete) {
      onConfigComplete({
        uri,
        dbName: config.dbName
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          🚀 MongoDB Atlas Setup Guide
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Follow these steps to set up your free MongoDB Atlas database (5-10 minutes)
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Create Account */}
        <div className="flex items-start space-x-4 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Create MongoDB Atlas Account
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Sign up for a free MongoDB Atlas account. No credit card required for the free tier.
            </p>
            <a
              href="https://cloud.mongodb.com/v2/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Sign Up for Free
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Step 2-5: Quick Instructions */}
        <div className="grid gap-4">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              2. Create Project → 3. Build Database → 4. Create User → 5. Network Access
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• <strong>Project Name:</strong> "NGFW Dashboard"</p>
              <p>• <strong>Cluster:</strong> Choose "M0 Sandbox" (FREE)</p>
              <p>• <strong>Region:</strong> Choose closest to your location</p>
              <p>• <strong>Database User:</strong> Create username/password (remember these!)</p>
              <p>• <strong>Network Access:</strong> Add IP "0.0.0.0/0" (allow from anywhere)</p>
            </div>
          </div>
        </div>

        {/* Step 6: Connection Details */}
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            6. Enter Your Connection Details
          </h4>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Database Username
              </label>
              <input
                type="text"
                placeholder="e.g., ngfw_admin"
                value={config.username}
                onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Database Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your database password"
                  value={config.password}
                  onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cluster Name
              </label>
              <input
                type="text"
                placeholder="e.g., cluster0.abc123"
                value={config.cluster}
                onChange={(e) => setConfig(prev => ({ ...prev, cluster: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Find this in your Atlas dashboard → Database → Connect → Connection String
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={config.dbName}
                onChange={(e) => setConfig(prev => ({ ...prev, dbName: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {generateConnectionString() && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Generated Connection String:
                </p>
                <button
                  onClick={() => copyToClipboard(generateConnectionString())}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </button>
              </div>
              <code className="text-xs text-gray-800 dark:text-gray-200 break-all block">
                {generateConnectionString()}
              </code>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleComplete}
              disabled={!config.username || !config.password || !config.cluster}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Use This Configuration
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
            💡 Need Help?
          </h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• MongoDB Atlas free tier gives you 512MB storage (perfect for this app)</li>
            <li>• No credit card required for the free tier</li>
            <li>• If you get stuck, check the MongoDB Atlas documentation</li>
            <li>• Make sure to whitelist your IP address in Network Access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
