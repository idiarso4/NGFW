'use client';

import React, { useState } from 'react';
import { DatabaseSetup } from '@/components/database/database-setup';
import { MongoDBAtlasGuide } from '@/components/database/mongodb-atlas-guide';

export default function DatabaseSetupPage() {
  const [showAtlasGuide, setShowAtlasGuide] = useState(false);

  const handleAtlasConfig = async (config: { uri: string; dbName: string }) => {
    try {
      // Test the connection first
      const testResponse = await fetch('/api/database/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'atlas',
          config
        })
      });

      const testResult = await testResponse.json();

      if (testResult.success) {
        // Setup the database configuration
        const setupResponse = await fetch('/api/database/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'atlas',
            config
          })
        });

        const setupResult = await setupResponse.json();

        if (setupResult.success) {
          alert('✅ Database configured successfully! Please restart the application to apply changes.');
          window.location.href = '/';
        } else {
          alert(`❌ Setup failed: ${setupResult.error}`);
        }
      } else {
        alert(`❌ Connection test failed: ${testResult.error}\n\nSuggestion: ${testResult.suggestion || 'Check your configuration'}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🗄️ Database Setup
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Configure your MongoDB database connection
          </p>
        </div>

        {/* Quick Setup Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🚀 MongoDB Atlas (Recommended)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Free cloud database. No installation required. Perfect for production.
            </p>
            <button
              onClick={() => setShowAtlasGuide(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Setup MongoDB Atlas
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💻 Local MongoDB
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Install MongoDB on your local machine. Good for development.
            </p>
            <a
              href="https://www.mongodb.com/try/download/community"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Download MongoDB
            </a>
          </div>
        </div>

        {/* Atlas Guide */}
        {showAtlasGuide && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                MongoDB Atlas Setup
              </h2>
              <button
                onClick={() => setShowAtlasGuide(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕ Close
              </button>
            </div>
            <MongoDBAtlasGuide onConfigComplete={handleAtlasConfig} />
          </div>
        )}

        {/* Advanced Setup */}
        {!showAtlasGuide && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Advanced Configuration
            </h2>
            <DatabaseSetup onDatabaseSelected={(type) => {
              console.log(`Database ${type} configured`);
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
