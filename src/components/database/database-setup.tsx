'use client';

import React, { useState, useEffect } from 'react';
import { Database, Cloud, Server, CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/utils';
import { AtlasQuickSetup } from './atlas-quick-setup';

interface DatabaseConfig {
  type: 'local' | 'atlas';
  uri: string;
  dbName: string;
  displayName: string;
  description: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastConnected?: Date;
  error?: string;
}

interface DatabaseSetupProps {
  onDatabaseSelected?: (type: 'local' | 'atlas') => void;
  className?: string;
}

export function DatabaseSetup({ onDatabaseSelected, className }: DatabaseSetupProps) {
  const [databases, setDatabases] = useState<Record<string, DatabaseConfig>>({
    local: {
      type: 'local',
      uri: 'mongodb://localhost:27017',
      dbName: 'ngfw_dashboard_local',
      displayName: 'Local MongoDB',
      description: 'MongoDB running on your local machine',
      status: 'disconnected'
    },
    atlas: {
      type: 'atlas',
      uri: '',
      dbName: 'ngfw_dashboard_cloud',
      displayName: 'MongoDB Atlas (Cloud)',
      description: 'MongoDB Atlas cloud database service',
      status: 'disconnected'
    }
  });

  const [selectedType, setSelectedType] = useState<'local' | 'atlas' | null>(null);
  const [showAtlasSetup, setShowAtlasSetup] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [atlasConfig, setAtlasConfig] = useState({
    uri: '',
    dbName: 'ngfw_dashboard_cloud',
    username: '',
    password: '',
    cluster: ''
  });

  const testConnection = async (type: 'local' | 'atlas') => {
    setDatabases(prev => ({
      ...prev,
      [type]: { ...prev[type], status: 'connecting' }
    }));

    try {
      const config = databases[type];
      const response = await fetch('/api/database/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config })
      });

      const result = await response.json();

      setDatabases(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: result.success ? 'connected' : 'error',
          error: result.success ? undefined : result.error,
          lastConnected: result.success ? new Date() : prev[type].lastConnected
        }
      }));

      return result.success;
    } catch (error) {
      setDatabases(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'error',
          error: error instanceof Error ? error.message : 'Connection failed'
        }
      }));
      return false;
    }
  };

  const setupDatabase = async (type: 'local' | 'atlas') => {
    const success = await testConnection(type);
    if (success) {
      try {
        const response = await fetch('/api/database/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type })
        });

        const result = await response.json();
        if (result.success) {
          onDatabaseSelected?.(type);
        }
      } catch (error) {
        console.error('Database setup failed:', error);
      }
    }
  };

  const generateAtlasUri = () => {
    if (atlasConfig.username && atlasConfig.password && atlasConfig.cluster) {
      return `mongodb+srv://${atlasConfig.username}:${atlasConfig.password}@${atlasConfig.cluster}.mongodb.net/${atlasConfig.dbName}?retryWrites=true&w=majority`;
    }
    return '';
  };

  const updateAtlasConfig = () => {
    const uri = generateAtlasUri();
    setDatabases(prev => ({
      ...prev,
      atlas: {
        ...prev.atlas,
        uri,
        dbName: atlasConfig.dbName
      }
    }));
    setAtlasConfig(prev => ({ ...prev, uri }));
  };

  useEffect(() => {
    updateAtlasConfig();
  }, [atlasConfig.username, atlasConfig.password, atlasConfig.cluster, atlasConfig.dbName]);

  const handleQuickSetupConfig = (config: { username: string; password: string; cluster: string; dbName: string }) => {
    setAtlasConfig(prev => ({ ...prev, ...config }));
    setShowQuickSetup(false);
    setShowAtlasSetup(true);
  };

  const DatabaseCard = ({ type, config }: { type: 'local' | 'atlas'; config: DatabaseConfig }) => (
    <div className={cn(
      'relative p-6 border rounded-lg transition-all duration-200',
      selectedType === type 
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'p-2 rounded-lg',
            type === 'local' 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
          )}>
            {type === 'local' ? <Server className="h-5 w-5" /> : <Cloud className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {config.displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {config.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {config.status === 'connecting' && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
          {config.status === 'connected' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {config.status === 'error' && (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          {config.status === 'disconnected' && (
            <AlertCircle className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Database:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{config.dbName}</span>
        </div>

        {config.uri && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">URI:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono text-xs">
              {type === 'atlas' && config.uri.includes('@') 
                ? config.uri.replace(/:([^:@]+)@/, ':***@') 
                : config.uri}
            </span>
          </div>
        )}

        {config.status === 'error' && config.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">{config.error}</p>
            {type === 'local' && config.error.includes('MongoDB is not running') && (
              <div className="text-xs text-red-600 dark:text-red-400">
                <p className="font-medium mb-1">💡 Quick Solutions:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Try MongoDB Atlas instead (free cloud option)</li>
                  <li>Install MongoDB: <a href="https://www.mongodb.com/try/download/community" target="_blank" rel="noopener noreferrer" className="underline">Download here</a></li>
                  <li>Use Docker: <code className="bg-red-100 dark:bg-red-800 px-1 rounded">docker run -d -p 27017:27017 mongo</code></li>
                </ul>
              </div>
            )}
          </div>
        )}

        {config.status === 'connected' && config.lastConnected && (
          <div className="text-xs text-green-600 dark:text-green-400">
            Connected at {config.lastConnected.toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => testConnection(type)}
          disabled={config.status === 'connecting'}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {config.status === 'connecting' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </button>

        <button
          onClick={() => setupDatabase(type)}
          disabled={config.status !== 'connected'}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Setup Database
        </button>
      </div>

      {type === 'atlas' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowQuickSetup(!showQuickSetup)}
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center font-medium"
          >
            🚀 Quick Setup Guide
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowAtlasSetup(!showAtlasSetup)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center"
          >
            Manual Configuration
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Database Setup
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select between local MongoDB or cloud-based MongoDB Atlas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DatabaseCard type="local" config={databases.local} />
        <DatabaseCard type="atlas" config={databases.atlas} />
      </div>

      {showAtlasSetup && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            MongoDB Atlas Configuration
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={atlasConfig.username}
                onChange={(e) => setAtlasConfig(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Database username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={atlasConfig.password}
                onChange={(e) => setAtlasConfig(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Database password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cluster Name
              </label>
              <input
                type="text"
                value={atlasConfig.cluster}
                onChange={(e) => setAtlasConfig(prev => ({ ...prev, cluster: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="cluster0.abc123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Database Name
              </label>
              <input
                type="text"
                value={atlasConfig.dbName}
                onChange={(e) => setAtlasConfig(prev => ({ ...prev, dbName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="ngfw_dashboard_cloud"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Connection String
            </label>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md border">
              <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                {generateAtlasUri() || 'Fill in the fields above to generate connection string'}
              </code>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
              🚀 Quick MongoDB Atlas Setup (Recommended):
            </h4>
            <ol className="text-sm text-green-700 dark:text-green-300 space-y-2 list-decimal list-inside">
              <li>Go to <a href="https://cloud.mongodb.com/v2/register" target="_blank" rel="noopener noreferrer" className="underline font-medium">MongoDB Atlas</a> and create free account</li>
              <li>Create a new project (e.g., "NGFW Dashboard")</li>
              <li>Build a database → Choose "M0 Sandbox" (Free tier)</li>
              <li>Choose cloud provider and region</li>
              <li>Create cluster (takes 1-3 minutes)</li>
              <li>Create database user with username/password</li>
              <li>Add IP address to Network Access (use 0.0.0.0/0 for testing)</li>
              <li>Get connection string and fill the form above</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
              📋 How to find your MongoDB Atlas information:
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🔍 Finding Cluster Name:
                </h5>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside ml-2">
                  <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">MongoDB Atlas Dashboard</a></li>
                  <li>Login to your account</li>
                  <li>Select your project</li>
                  <li>Look for your cluster in the "Clusters" section</li>
                  <li>The cluster name is displayed (e.g., "Cluster0", "MyCluster")</li>
                </ol>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🗄️ Database Name:
                </h5>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside ml-2">
                  <li>You can choose any name (e.g., "ngfw_dashboard", "production_db")</li>
                  <li>If database doesn't exist, it will be created automatically</li>
                  <li>Use descriptive names like "ngfw_dashboard_prod" or "firewall_data"</li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🔐 Getting Connection String:
                </h5>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside ml-2">
                  <li>Click "Connect" button on your cluster</li>
                  <li>Choose "Connect your application"</li>
                  <li>Select "Node.js" driver</li>
                  <li>Copy the connection string</li>
                  <li>Replace <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">&lt;password&gt;</code> with your actual password</li>
                </ol>
              </div>

              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  💡 <strong>Tip:</strong> Your connection string format will be:<br/>
                  <code className="text-xs">mongodb+srv://&lt;username&gt;:&lt;password&gt;@&lt;cluster&gt;.xxxxx.mongodb.net/</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuickSetup && (
        <div className="mt-6">
          <AtlasQuickSetup onConfigGenerated={handleQuickSetupConfig} />
        </div>
      )}
    </div>
  );
}
