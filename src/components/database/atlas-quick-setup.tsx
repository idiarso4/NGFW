'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface AtlasQuickSetupProps {
  onConfigGenerated?: (config: { username: string; password: string; cluster: string; dbName: string }) => void;
}

export function AtlasQuickSetup({ onConfigGenerated }: AtlasQuickSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    username: '',
    password: '',
    cluster: '',
    dbName: 'ngfw_dashboard_cloud'
  });

  const steps = [
    {
      id: 1,
      title: 'Create MongoDB Atlas Account',
      description: 'Sign up for free MongoDB Atlas account',
      action: 'Sign Up',
      url: 'https://cloud.mongodb.com/v2/register',
      completed: false
    },
    {
      id: 2,
      title: 'Create Project',
      description: 'Create a new project for your NGFW Dashboard',
      action: 'Create Project',
      completed: false
    },
    {
      id: 3,
      title: 'Build Database',
      description: 'Create a free M0 Sandbox cluster',
      action: 'Build Database',
      completed: false
    },
    {
      id: 4,
      title: 'Create Database User',
      description: 'Set up authentication credentials',
      action: 'Create User',
      completed: false
    },
    {
      id: 5,
      title: 'Configure Network Access',
      description: 'Allow connections from your IP',
      action: 'Add IP Address',
      completed: false
    },
    {
      id: 6,
      title: 'Get Connection String',
      description: 'Copy your connection details',
      action: 'Connect',
      completed: false
    }
  ];

  const handleStepComplete = (stepId: number) => {
    setCurrentStep(stepId + 1);
  };

  const generateConnectionString = () => {
    if (config.username && config.password && config.cluster) {
      return `mongodb+srv://${config.username}:${config.password}@${config.cluster}.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;
    }
    return '';
  };

  const handleConfigSubmit = () => {
    if (onConfigGenerated) {
      onConfigGenerated(config);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🚀 MongoDB Atlas Quick Setup
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Follow these steps to set up your free MongoDB Atlas database in 5-10 minutes
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start space-x-4 p-4 rounded-lg border ${
              currentStep === step.id
                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                : currentStep > step.id
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className="flex-shrink-0">
              {currentStep > step.id ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : currentStep === step.id ? (
                <Clock className="h-6 w-6 text-blue-500" />
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {step.id}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {step.description}
              </p>

              {/* Step-specific content */}
              {currentStep === step.id && (
                <div className="mt-3">
                  {step.id === 1 && (
                    <div className="space-y-3">
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                      >
                        {step.action}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="ml-3 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        I've signed up
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}

                  {step.id === 2 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        1. Click "New Project" in Atlas dashboard<br/>
                        2. Name it "NGFW Dashboard"<br/>
                        3. Click "Create Project"
                      </p>
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Project created
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}

                  {step.id === 3 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        1. Click "Build a Database"<br/>
                        2. Choose "M0 Sandbox" (FREE)<br/>
                        3. Select cloud provider and region<br/>
                        4. Keep cluster name as "Cluster0"<br/>
                        5. Click "Create"
                      </p>
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Database created
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}

                  {step.id === 4 && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Create a database user with username and password:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Username (e.g., ngfw_admin)"
                          value={config.username}
                          onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={config.password}
                          onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        disabled={!config.username || !config.password}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        User created
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}

                  {step.id === 5 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        1. Go to "Network Access" in sidebar<br/>
                        2. Click "Add IP Address"<br/>
                        3. Choose "Allow Access from Anywhere" (0.0.0.0/0)<br/>
                        4. Click "Confirm"
                      </p>
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Network configured
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}

                  {step.id === 6 && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        1. Go back to "Database" → Click "Connect" on your cluster<br/>
                        2. Choose "Connect your application"<br/>
                        3. Copy the cluster part from connection string (e.g., cluster0.abc123)
                      </p>
                      <input
                        type="text"
                        placeholder="Cluster name (e.g., cluster0.abc123)"
                        value={config.cluster}
                        onChange={(e) => setConfig(prev => ({ ...prev, cluster: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {generateConnectionString() && (
                        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Generated connection string:</p>
                          <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                            {generateConnectionString()}
                          </code>
                        </div>
                      )}
                      <button
                        onClick={handleConfigSubmit}
                        disabled={!config.cluster}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
                      >
                        Use This Configuration
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          💡 <strong>Tip:</strong> MongoDB Atlas free tier gives you 512MB storage, which is perfect for testing and small applications. No credit card required!
        </p>
      </div>
    </div>
  );
}
