'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/utils';
import {
  Globe,
  Shield,
  Server,
  Smartphone,
  Database,
  Cloud,
  Lock,
  Wifi,
  Mail,
  FileText,
  Download,
  Eye,
  Plus,
  Star,
  Clock,
} from 'lucide-react';

interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  rules: Array<{
    name: string;
    source: string;
    destination: string;
    service: string;
    action: string;
  }>;
  popularity: number;
  lastUpdated: Date;
  tags: string[];
}

const templates: RuleTemplate[] = [
  {
    id: '1',
    name: 'Web Server Protection',
    description: 'Essential security rules for web servers (HTTP/HTTPS)',
    category: 'web',
    icon: <Globe className="h-6 w-6" />,
    color: 'blue',
    rules: [
      { name: 'Allow HTTP Traffic', source: 'any', destination: '192.168.1.0/24', service: 'TCP:80', action: 'allow' },
      { name: 'Allow HTTPS Traffic', source: 'any', destination: '192.168.1.0/24', service: 'TCP:443', action: 'allow' },
      { name: 'Block Admin Ports', source: 'any', destination: '192.168.1.0/24', service: 'TCP:8080,8443', action: 'deny' },
      { name: 'Block FTP Access', source: 'any', destination: '192.168.1.0/24', service: 'TCP:21', action: 'deny' },
    ],
    popularity: 95,
    lastUpdated: new Date('2024-01-15'),
    tags: ['web', 'http', 'https', 'server', 'security'],
  },
  {
    id: '2',
    name: 'Security Hardening',
    description: 'Essential security rules to block common threats',
    category: 'security',
    icon: <Shield className="h-6 w-6" />,
    color: 'red',
    rules: [
      { name: 'Block Malicious IPs', source: 'threat-intel', destination: 'any', service: 'any', action: 'deny' },
      { name: 'Block P2P Traffic', source: 'any', destination: 'any', service: 'BitTorrent', action: 'drop' },
      { name: 'Block Tor Exit Nodes', source: 'tor-nodes', destination: 'any', service: 'any', action: 'deny' },
    ],
    popularity: 88,
    lastUpdated: new Date('2024-01-12'),
    tags: ['security', 'malware', 'p2p', 'tor'],
  },
  {
    id: '3',
    name: 'Database Server Access',
    description: 'Secure database server access rules',
    category: 'application',
    icon: <Database className="h-6 w-6" />,
    color: 'green',
    rules: [
      { name: 'Allow MySQL', source: 'app-servers', destination: 'db-servers', service: 'TCP:3306', action: 'allow' },
      { name: 'Allow PostgreSQL', source: 'app-servers', destination: 'db-servers', service: 'TCP:5432', action: 'allow' },
      { name: 'Block External DB Access', source: 'external', destination: 'db-servers', service: 'TCP:3306,5432', action: 'deny' },
    ],
    popularity: 76,
    lastUpdated: new Date('2024-01-10'),
    tags: ['database', 'mysql', 'postgresql', 'application'],
  },
  {
    id: '4',
    name: 'Remote Work Setup',
    description: 'Rules for secure remote work access',
    category: 'network',
    icon: <Wifi className="h-6 w-6" />,
    color: 'purple',
    rules: [
      { name: 'Allow VPN Access', source: 'any', destination: 'vpn-server', service: 'UDP:1194', action: 'allow' },
      { name: 'Allow RDP', source: 'vpn-users', destination: 'workstations', service: 'TCP:3389', action: 'allow' },
      { name: 'Block Direct RDP', source: 'external', destination: 'workstations', service: 'TCP:3389', action: 'deny' },
    ],
    popularity: 82,
    lastUpdated: new Date('2024-01-08'),
    tags: ['vpn', 'remote', 'rdp', 'work'],
  },
  {
    id: '5',
    name: 'Email Server Rules',
    description: 'Standard email server protection rules',
    category: 'application',
    icon: <Mail className="h-6 w-6" />,
    color: 'yellow',
    rules: [
      { name: 'Allow SMTP', source: 'any', destination: 'mail-server', service: 'TCP:25', action: 'allow' },
      { name: 'Allow SMTPS', source: 'any', destination: 'mail-server', service: 'TCP:465', action: 'allow' },
      { name: 'Allow IMAP', source: 'internal', destination: 'mail-server', service: 'TCP:143', action: 'allow' },
      { name: 'Allow IMAPS', source: 'internal', destination: 'mail-server', service: 'TCP:993', action: 'allow' },
    ],
    popularity: 71,
    lastUpdated: new Date('2024-01-05'),
    tags: ['email', 'smtp', 'imap', 'mail'],
  },
  {
    id: '6',
    name: 'Cloud Services Access',
    description: 'Rules for accessing cloud services securely',
    category: 'network',
    icon: <Cloud className="h-6 w-6" />,
    color: 'indigo',
    rules: [
      { name: 'Allow AWS Services', source: 'internal', destination: 'aws-endpoints', service: 'TCP:443', action: 'allow' },
      { name: 'Allow Azure Services', source: 'internal', destination: 'azure-endpoints', service: 'TCP:443', action: 'allow' },
      { name: 'Allow Google Cloud', source: 'internal', destination: 'gcp-endpoints', service: 'TCP:443', action: 'allow' },
    ],
    popularity: 69,
    lastUpdated: new Date('2024-01-03'),
    tags: ['cloud', 'aws', 'azure', 'gcp'],
  },
];

interface RuleTemplatesProps {
  searchQuery: string;
  category: string;
}

export function RuleTemplates({ searchQuery, category }: RuleTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<RuleTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Category filter
      if (category !== 'all' && template.category !== category) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    }).sort((a, b) => b.popularity - a.popularity);
  }, [searchQuery, category]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      red: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      green: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={cn('p-3 rounded-lg border', getColorClasses(template.color))}>
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {template.popularity}%
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {template.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {template.description}
            </p>

            {/* Rules Preview */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Rules ({template.rules.length})
              </h4>
              <div className="space-y-1">
                {template.rules.slice(0, 2).map((rule, index) => (
                  <div key={index} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                    <span className="font-medium">{rule.name}:</span> {rule.action.toUpperCase()}
                  </div>
                ))}
                {template.rules.length > 2 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    +{template.rules.length - 2} more rules
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Plus className="h-4 w-4 mr-1" />
                  Use Template
                </button>
                <button className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 shadow-sm rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedTemplate(null)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-3 rounded-lg border', getColorClasses(selectedTemplate.color))}>
                      {selectedTemplate.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedTemplate.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTemplate.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Rules in this template:
                </h4>
                <div className="space-y-3">
                  {selectedTemplate.rules.map((rule, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {rule.name}
                        </h5>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          rule.action === 'allow' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          rule.action === 'deny' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        )}>
                          {rule.action.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Source:</span>
                          <div className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded mt-1">
                            {rule.source}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Destination:</span>
                          <div className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded mt-1">
                            {rule.destination}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Service:</span>
                          <div className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded mt-1">
                            {rule.service}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
