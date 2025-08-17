'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { OverviewCards, SystemMetricsCards } from '@/components/dashboard/overview-cards';
import { QuickActionsPanel } from '@/components/dashboard/quick-actions';
import { TrafficChart, ThreatTrendChart } from '@/components/charts/traffic-chart';
import { formatDate } from '@/utils';
import { Database, ExternalLink, X, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentThreats, setRecentThreats] = useState([]);
  const [topApplications, setTopApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatabaseBanner, setShowDatabaseBanner] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();

        // Fetch recent threats
        const threatsResponse = await fetch('/api/threats/events?limit=5');
        const threatsData = await threatsResponse.json();

        // Fetch network connections for top applications
        const connectionsResponse = await fetch('/api/network/connections?limit=100');
        const connectionsData = await connectionsResponse.json();

        if (statsData.success) {
          setDashboardData(statsData.data);
          setUsingMockData(false); // No more mock data
        } else if (statsData.requiresDatabase) {
          // Database is required
          setUsingMockData(true); // Show database setup banner
        }

        if (threatsData.success) {
          setRecentThreats(threatsData.data.threats.slice(0, 3));
        }

        if (connectionsData.success && connectionsData.data.stats.topApplications) {
          setTopApplications(connectionsData.data.stats.topApplications.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Database Setup Required Banner */}
        {showDatabaseBanner && usingMockData && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    🚨 Database Connection Required
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    The NGFW Dashboard requires a database connection to function. No mock data is available - you must configure a real database to use this application.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/database-setup"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Setup Database Now
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                    <a
                      href="https://cloud.mongodb.com/v2/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-md transition-colors"
                    >
                      Get Free MongoDB Atlas
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="mt-3 text-xs text-red-600 dark:text-red-400">
                    💡 <strong>Tip:</strong> MongoDB Atlas offers a free tier that's perfect for this application
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDatabaseBanner(false)}
                className="flex-shrink-0 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Security Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Real-time overview of your network security status
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatDate(new Date(), 'MMM dd, yyyy HH:mm')}
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Refresh
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards data={dashboardData} loading={loading} />

        {/* System Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Performance
          </h2>
          <SystemMetricsCards />
        </div>

        {/* Traffic Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Network Traffic
            </h3>
            <TrafficChart height={250} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Threat Trends
            </h3>
            <ThreatTrendChart height={250} />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsPanel />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Threats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Threats
            </h3>
            <div className="space-y-3">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : recentThreats.length > 0 ? (
                recentThreats.map((threat: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        threat.severity === 'critical' || threat.severity === 'high'
                          ? 'bg-red-500'
                          : threat.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {threat.signature || threat.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        From {threat.source}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(threat.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No recent threats found
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View all threats →
              </button>
            </div>
          </div>

          {/* Top Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Applications
            </h3>
            <div className="space-y-3">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                      <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/3"></div>
                    </div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                ))
              ) : topApplications.length > 0 ? (
                topApplications.map((app: any, index: number) => {
                  const totalConnections = topApplications.reduce((sum: number, a: any) => sum + a.connections, 0);
                  const percentage = totalConnections > 0 ? Math.round((app.connections / totalConnections) * 100) : 0;
                  const formatBytes = (bytes: number) => {
                    if (bytes === 0) return '0 B';
                    const k = 1024;
                    const sizes = ['B', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
                  };

                  return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.application}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBytes(app.bytes)} • {app.connections} connections
                    </span>
                  </div>
                </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No application data available
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View detailed analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
