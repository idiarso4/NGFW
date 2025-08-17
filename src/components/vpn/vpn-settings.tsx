'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';
import {
  Settings,
  Shield,
  Network,
  Key,
  Clock,
  Globe,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: Setting[];
}

interface Setting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'number';
  value: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
}

export function VpnSettings() {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic VPN server configuration',
      icon: <Settings className="h-5 w-5" />,
      settings: [
        {
          id: 'enabled',
          name: 'VPN Server Enabled',
          description: 'Enable or disable the VPN server',
          type: 'toggle',
          value: true,
        },
        {
          id: 'port',
          name: 'Listen Port',
          description: 'Port number for VPN connections',
          type: 'number',
          value: 1194,
          min: 1,
          max: 65535,
        },
        {
          id: 'protocol',
          name: 'Protocol',
          description: 'VPN protocol to use',
          type: 'select',
          value: 'udp',
          options: [
            { label: 'UDP', value: 'udp' },
            { label: 'TCP', value: 'tcp' },
          ],
        },
        {
          id: 'max_clients',
          name: 'Maximum Clients',
          description: 'Maximum number of concurrent connections',
          type: 'number',
          value: 100,
          min: 1,
          max: 1000,
        },
      ],
    },
    {
      id: 'network',
      title: 'Network Configuration',
      description: 'IP addressing and routing settings',
      icon: <Network className="h-5 w-5" />,
      settings: [
        {
          id: 'server_subnet',
          name: 'Server Subnet',
          description: 'VPN server subnet (CIDR notation)',
          type: 'input',
          value: '10.8.0.0/24',
          placeholder: '10.8.0.0/24',
        },
        {
          id: 'dns_servers',
          name: 'DNS Servers',
          description: 'DNS servers to push to clients',
          type: 'input',
          value: '8.8.8.8, 8.8.4.4',
          placeholder: '8.8.8.8, 8.8.4.4',
        },
        {
          id: 'redirect_gateway',
          name: 'Redirect Gateway',
          description: 'Route all client traffic through VPN',
          type: 'toggle',
          value: false,
        },
        {
          id: 'local_networks',
          name: 'Local Networks',
          description: 'Local networks accessible via VPN',
          type: 'input',
          value: '192.168.1.0/24, 10.0.0.0/8',
          placeholder: '192.168.1.0/24, 10.0.0.0/8',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Encryption and authentication configuration',
      icon: <Shield className="h-5 w-5" />,
      settings: [
        {
          id: 'cipher',
          name: 'Encryption Cipher',
          description: 'Encryption algorithm to use',
          type: 'select',
          value: 'AES-256-GCM',
          options: [
            { label: 'AES-256-GCM', value: 'AES-256-GCM' },
            { label: 'AES-256-CBC', value: 'AES-256-CBC' },
            { label: 'AES-128-GCM', value: 'AES-128-GCM' },
            { label: 'AES-128-CBC', value: 'AES-128-CBC' },
          ],
        },
        {
          id: 'auth',
          name: 'HMAC Authentication',
          description: 'HMAC authentication algorithm',
          type: 'select',
          value: 'SHA256',
          options: [
            { label: 'SHA256', value: 'SHA256' },
            { label: 'SHA512', value: 'SHA512' },
            { label: 'SHA1', value: 'SHA1' },
          ],
        },
        {
          id: 'tls_auth',
          name: 'TLS Authentication',
          description: 'Enable TLS authentication for additional security',
          type: 'toggle',
          value: true,
        },
        {
          id: 'cert_expire',
          name: 'Certificate Validity',
          description: 'Certificate validity period',
          type: 'number',
          value: 365,
          min: 30,
          max: 3650,
          unit: 'days',
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      description: 'Advanced VPN server options',
      icon: <Key className="h-5 w-5" />,
      settings: [
        {
          id: 'keepalive',
          name: 'Keepalive Interval',
          description: 'Keepalive ping interval',
          type: 'number',
          value: 10,
          min: 1,
          max: 300,
          unit: 'seconds',
        },
        {
          id: 'timeout',
          name: 'Connection Timeout',
          description: 'Connection timeout period',
          type: 'number',
          value: 120,
          min: 30,
          max: 3600,
          unit: 'seconds',
        },
        {
          id: 'compression',
          name: 'Enable Compression',
          description: 'Enable LZO compression',
          type: 'toggle',
          value: true,
        },
        {
          id: 'duplicate_cn',
          name: 'Allow Duplicate CN',
          description: 'Allow multiple connections with same certificate',
          type: 'toggle',
          value: false,
        },
      ],
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prevSettings =>
      prevSettings.map(section =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map(setting =>
                setting.id === settingId ? { ...setting, value } : setting
              ),
            }
          : section
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate save operation
    console.log('Saving VPN settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
    // Reload original settings
  };

  const renderSetting = (sectionId: string, setting: Setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                {setting.name}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
            <button
              onClick={() => handleSettingChange(sectionId, setting.id, !setting.value)}
              className={cn(
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                setting.value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  setting.value ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              {setting.name}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {setting.description}
            </p>
            <select
              value={setting.value}
              onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {setting.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'input':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              {setting.name}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {setting.description}
            </p>
            <input
              type="text"
              value={setting.value}
              onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
              placeholder={setting.placeholder}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              {setting.name}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {setting.description}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={setting.value}
                onChange={(e) => handleSettingChange(sectionId, setting.id, parseInt(e.target.value))}
                min={setting.min}
                max={setting.max}
                className="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {setting.unit && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {setting.unit}
                </span>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Save/Reset buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            VPN Server Configuration
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure VPN server settings and security options
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Unsaved changes</span>
            </div>
          )}
          
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settings.map((section) => (
          <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant">
            {/* Section Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                {section.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id}>
                  {renderSetting(section.id, setting)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Configuration Notes
            </h4>
            <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
              <ul className="list-disc list-inside space-y-1">
                <li>Changes to network settings may require VPN server restart</li>
                <li>Certificate changes will affect all connected clients</li>
                <li>Always test configuration changes in a staging environment first</li>
                <li>Backup current configuration before making major changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
