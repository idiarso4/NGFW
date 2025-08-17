'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatDate, formatBytes } from '@/utils';
import {
  Network,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface VpnTunnel {
  id: string;
  name: string;
  type: 'site-to-site' | 'remote-access' | 'ssl-vpn' | 'ipsec';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  localEndpoint: string;
  remoteEndpoint: string;
  protocol: string;
  encryption: string;
  uptime: number; // in seconds
  bytesIn: number;
  bytesOut: number;
  lastConnected: Date;
  createdAt: Date;
  createdBy: string;
}

interface VpnTunnelsProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

// Sample VPN tunnels data
const sampleTunnels: VpnTunnel[] = [
  {
    id: '1',
    name: 'Branch Office - Singapore',
    type: 'site-to-site',
    status: 'connected',
    localEndpoint: '192.168.1.1',
    remoteEndpoint: '203.0.113.15',
    protocol: 'IPSec',
    encryption: 'AES-256',
    uptime: 86400 * 7, // 7 days
    bytesIn: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
    bytesOut: 1.8 * 1024 * 1024 * 1024, // 1.8 GB
    lastConnected: new Date(),
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin',
  },
  {
    id: '2',
    name: 'Remote Workers SSL',
    type: 'ssl-vpn',
    status: 'connected',
    localEndpoint: '10.0.0.1',
    remoteEndpoint: '0.0.0.0/0',
    protocol: 'SSL/TLS',
    encryption: 'AES-256',
    uptime: 86400 * 3, // 3 days
    bytesIn: 890 * 1024 * 1024, // 890 MB
    bytesOut: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
    lastConnected: new Date(),
    createdAt: new Date('2024-01-10'),
    createdBy: 'it-admin',
  },
  {
    id: '3',
    name: 'Branch Office - Tokyo',
    type: 'site-to-site',
    status: 'disconnected',
    localEndpoint: '192.168.2.1',
    remoteEndpoint: '198.51.100.42',
    protocol: 'IPSec',
    encryption: 'AES-256',
    uptime: 0,
    bytesIn: 1.5 * 1024 * 1024 * 1024, // 1.5 GB
    bytesOut: 980 * 1024 * 1024, // 980 MB
    lastConnected: new Date(Date.now() - 3600000), // 1 hour ago
    createdAt: new Date('2024-01-08'),
    createdBy: 'network-admin',
  },
  {
    id: '4',
    name: 'Executive Remote Access',
    type: 'remote-access',
    status: 'connected',
    localEndpoint: '172.16.0.1',
    remoteEndpoint: 'dynamic',
    protocol: 'L2TP/IPSec',
    encryption: 'AES-128',
    uptime: 86400 * 2, // 2 days
    bytesIn: 450 * 1024 * 1024, // 450 MB
    bytesOut: 320 * 1024 * 1024, // 320 MB
    lastConnected: new Date(),
    createdAt: new Date('2024-01-05'),
    createdBy: 'admin',
  },
  {
    id: '5',
    name: 'Partner Network',
    type: 'ipsec',
    status: 'error',
    localEndpoint: '10.10.0.1',
    remoteEndpoint: '203.0.113.195',
    protocol: 'IPSec',
    encryption: 'AES-256',
    uptime: 0,
    bytesIn: 0,
    bytesOut: 0,
    lastConnected: new Date(Date.now() - 7200000), // 2 hours ago
    createdAt: new Date('2024-01-12'),
    createdBy: 'security-team',
  },
];

export function VpnTunnels({ searchQuery, statusFilter, typeFilter }: VpnTunnelsProps) {
  const [sortField, setSortField] = useState<keyof VpnTunnel>('uptime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredTunnels = useMemo(() => {
    let filtered = sampleTunnels.filter(tunnel => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tunnel.name.toLowerCase().includes(query) ||
          tunnel.localEndpoint.includes(query) ||
          tunnel.remoteEndpoint.includes(query) ||
          tunnel.protocol.toLowerCase().includes(query)
        );
      }
      return true;
    }).filter(tunnel => {
      // Status filter
      if (statusFilter !== 'all' && tunnel.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && tunnel.type !== typeFilter) {
        return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, typeFilter, sortField, sortDirection]);

  const handleSort = (field: keyof VpnTunnel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof VpnTunnel; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
    >
      <span>{children}</span>
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-3 w-3" />;
      case 'disconnected':
        return <XCircle className="h-3 w-3" />;
      case 'connecting':
        return <Clock className="h-3 w-3" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <XCircle className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'site-to-site': 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800',
      'remote-access': 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800',
      'ssl-vpn': 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
      'ipsec': 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800',
    };
    return colors[type as keyof typeof colors] || colors['ipsec'];
  };

  const formatUptime = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const tunnelStats = {
    total: filteredTunnels.length,
    connected: filteredTunnels.filter(t => t.status === 'connected').length,
    disconnected: filteredTunnels.filter(t => t.status === 'disconnected').length,
    error: filteredTunnels.filter(t => t.status === 'error').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {tunnelStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Tunnels</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {tunnelStats.connected}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Connected</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {tunnelStats.disconnected}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Disconnected</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {tunnelStats.error}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Error</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="name">Tunnel Name</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Endpoints
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Protocol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <SortButton field="uptime">Uptime</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Data Transfer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTunnels.map((tunnel) => (
              <tr key={tunnel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Network className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tunnel.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Created by {tunnel.createdBy}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getTypeColor(tunnel.type)
                  )}>
                    {tunnel.type.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusColor(tunnel.status)
                  )}>
                    {getStatusIcon(tunnel.status)}
                    <span className="ml-1">{tunnel.status.toUpperCase()}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    <div>Local: {tunnel.localEndpoint}</div>
                    <div>Remote: {tunnel.remoteEndpoint}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    <div>{tunnel.protocol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tunnel.encryption}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatUptime(tunnel.uptime)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="text-xs">
                    ↓ {formatBytes(tunnel.bytesIn)}
                  </div>
                  <div className="text-xs">
                    ↑ {formatBytes(tunnel.bytesOut)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === tunnel.id ? null : tunnel.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {showDropdown === tunnel.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Tunnel
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                            {tunnel.status === 'connected' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {tunnel.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Tunnel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTunnels.length === 0 && (
          <div className="text-center py-12">
            <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No VPN tunnels found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
