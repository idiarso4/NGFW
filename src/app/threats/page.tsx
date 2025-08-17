'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ThreatStats } from '@/components/threats/threat-stats';
import { ThreatDashboard } from '@/components/threats/threat-dashboard';
import { ThreatsList } from '@/components/threats/threats-list';
import { ThreatAnalytics } from '@/components/threats/threat-analytics';
import { 
  AlertTriangle, 
  Shield, 
  Download, 
  Settings,
  RefreshCw,
  Filter,
  Search,
} from 'lucide-react';

export default function ThreatsPage() {
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [threats, setThreats] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreatsData();
  }, []);

  const fetchThreatsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/threats/events');
      const data = await response.json();

      if (data.success) {
        setThreats(data.data.threats);
        setAnalytics(data.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching threats data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLiveMonitoring) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isLiveMonitoring, refreshInterval]);

  const toggleLiveMonitoring = () => {
    setIsLiveMonitoring(!isLiveMonitoring);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Threat Detection
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Real-time security threat monitoring and analysis
              </p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {/* Live Status */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className={`h-2 w-2 rounded-full ${isLiveMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isLiveMonitoring ? 'Live Detection' : 'Paused'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>

            {/* Refresh Interval */}
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="block px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={1}>1s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
            </select>

            {/* Control Buttons */}
            <button
              onClick={toggleLiveMonitoring}
              className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLiveMonitoring 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              {isLiveMonitoring ? (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Pause Detection
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Start Detection
                </>
              )}
            </button>

            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Download className="h-4 w-4 mr-2" />
              Export Threats
            </button>

            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Settings className="h-4 w-4 mr-2" />
              Detection Rules
            </button>
          </div>
        </div>

        {/* Threat Statistics */}
        <ThreatStats isLive={isLiveMonitoring} />

        {/* Threat Dashboard & Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ThreatDashboard 
              isLive={isLiveMonitoring}
              refreshInterval={refreshInterval}
            />
          </div>
          <div>
            <ThreatAnalytics isLive={isLiveMonitoring} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-elegant">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search threats by IP, signature, description..."
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
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="malware">Malware</option>
                <option value="intrusion">Intrusion</option>
                <option value="botnet">Botnet</option>
                <option value="phishing">Phishing</option>
                <option value="vulnerability">Vulnerability</option>
                <option value="spam">Spam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Threat Dashboard */}
        <ThreatDashboard
          threats={threats}
          isLive={isLiveMonitoring}
          refreshInterval={refreshInterval}
          loading={loading}
        />

        {/* Threat Analytics */}
        <ThreatAnalytics analytics={analytics} loading={loading} />

        {/* Threats List */}
        <ThreatsList
          threats={threats}
          isLive={isLiveMonitoring}
          refreshInterval={refreshInterval}
          searchQuery={searchQuery}
          severityFilter={selectedSeverity}
          typeFilter={selectedType}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
