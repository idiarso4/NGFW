// MongoDB Schema Definitions for NGFW Dashboard
import { ObjectId } from 'mongodb';

// ===== FIREWALL SCHEMAS =====
export interface FirewallRule {
  _id?: ObjectId;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  source: {
    type: 'any' | 'ip' | 'subnet' | 'group';
    value: string;
  };
  destination: {
    type: 'any' | 'ip' | 'subnet' | 'group';
    value: string;
  };
  service: {
    protocol: 'tcp' | 'udp' | 'icmp' | 'any';
    ports: string;
  };
  action: 'allow' | 'deny' | 'drop';
  schedule?: string;
  logging: boolean;
  hitCount: number;
  lastHit?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FirewallStats {
  _id?: ObjectId;
  timestamp: Date;
  totalRules: number;
  enabledRules: number;
  disabledRules: number;
  allowRules: number;
  denyRules: number;
  totalHits: number;
  topHitRules: Array<{
    ruleId: ObjectId;
    ruleName: string;
    hits: number;
  }>;
}

// ===== NETWORK SCHEMAS =====
export interface NetworkConnection {
  _id?: ObjectId;
  timestamp: Date;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  application?: string;
  user?: string;
  bytesIn: number;
  bytesOut: number;
  duration: number;
  status: 'active' | 'closed' | 'timeout' | 'blocked';
  country?: string;
  sessionId: string;
}

export interface NetworkTraffic {
  _id?: ObjectId;
  timestamp: Date;
  interface: string;
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  bandwidth: number;
  utilization: number;
}

export interface NetworkStats {
  _id?: ObjectId;
  timestamp: Date;
  totalConnections: number;
  activeConnections: number;
  blockedConnections: number;
  totalBandwidth: number;
  inboundTraffic: number;
  outboundTraffic: number;
  topApplications: Array<{
    name: string;
    bandwidth: number;
    connections: number;
  }>;
  topUsers: Array<{
    user: string;
    bandwidth: number;
    connections: number;
  }>;
}

// ===== THREAT SCHEMAS =====
export interface ThreatEvent {
  _id?: ObjectId;
  timestamp: Date;
  type: 'malware' | 'intrusion' | 'botnet' | 'phishing' | 'vulnerability' | 'spam';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  source: string;
  destination: string;
  description: string;
  signature: string;
  action: 'blocked' | 'quarantined' | 'logged' | 'alerted';
  blocked: boolean;
  details: {
    protocol?: string;
    port?: number;
    size?: number;
    country?: string;
    malwareFamily?: string;
    cveId?: string;
  };
  ruleId?: ObjectId;
  userId?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface ThreatStats {
  _id?: ObjectId;
  timestamp: Date;
  totalThreats: number;
  blockedThreats: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  threatsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  topSources: Array<{
    ip: string;
    country: string;
    threats: number;
    blocked: number;
  }>;
}

// ===== APPLICATION SCHEMAS =====
export interface Application {
  _id?: ObjectId;
  name: string;
  category: string;
  description: string;
  version?: string;
  vendor?: string;
  status: 'allowed' | 'blocked' | 'monitored' | 'restricted';
  risk: 'low' | 'medium' | 'high' | 'critical';
  users: number;
  bandwidth: number;
  sessions: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationPolicy {
  _id?: ObjectId;
  name: string;
  description: string;
  action: 'allow' | 'block' | 'monitor' | 'restrict';
  scope: 'global' | 'group' | 'user';
  target: string;
  applications: string[];
  schedule?: {
    type: 'always' | 'business_hours' | 'custom';
    details?: string;
  };
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  appliedTo: number;
}

// ===== WEB FILTER SCHEMAS =====
export interface WebFilterCategory {
  _id?: ObjectId;
  name: string;
  description: string;
  category: string;
  status: 'enabled' | 'disabled' | 'monitor';
  action: 'block' | 'allow' | 'monitor';
  sites: number;
  blocked: number;
  monitored: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  icon: string;
}

export interface BlockedSite {
  _id?: ObjectId;
  url: string;
  category: string;
  reason: string;
  status: 'blocked' | 'monitored' | 'allowed';
  attempts: number;
  lastAttempt: Date;
  users: number;
  addedBy: string;
  addedAt: Date;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

export interface WebFilterPolicy {
  _id?: ObjectId;
  name: string;
  description: string;
  action: 'allow' | 'block' | 'monitor';
  scope: 'global' | 'group' | 'user';
  target: string;
  categories: string[];
  schedule?: {
    type: 'always' | 'business_hours' | 'custom';
    details?: string;
  };
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  appliedTo: number;
}

// ===== VPN SCHEMAS =====
export interface VpnTunnel {
  _id?: ObjectId;
  name: string;
  type: 'site-to-site' | 'remote-access' | 'ssl-vpn' | 'ipsec';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  localEndpoint: string;
  remoteEndpoint: string;
  protocol: string;
  encryption: string;
  uptime: number;
  bytesIn: number;
  bytesOut: number;
  lastConnected: Date;
  createdAt: Date;
  createdBy: string;
  config: {
    presharedKey?: string;
    certificate?: string;
    dhGroup?: string;
    ikeVersion?: string;
    espEncryption?: string;
    espAuthentication?: string;
  };
}

export interface VpnUser {
  _id?: ObjectId;
  username: string;
  email: string;
  fullName: string;
  status: 'connected' | 'disconnected' | 'disabled';
  ipAddress?: string;
  connectionTime?: Date;
  sessionDuration: number;
  bytesIn: number;
  bytesOut: number;
  lastLogin: Date;
  group: string;
  certificate: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VpnSettings {
  _id?: ObjectId;
  serverEnabled: boolean;
  listenPort: number;
  protocol: 'udp' | 'tcp';
  maxClients: number;
  serverSubnet: string;
  dnsServers: string[];
  redirectGateway: boolean;
  localNetworks: string[];
  encryption: {
    cipher: string;
    auth: string;
    tlsAuth: boolean;
  };
  advanced: {
    keepaliveInterval: number;
    connectionTimeout: number;
    compression: boolean;
    duplicateCn: boolean;
  };
  updatedAt: Date;
  updatedBy: string;
}

// ===== SYSTEM SCHEMAS =====
export interface SystemStats {
  _id?: ObjectId;
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    interfaces: Array<{
      name: string;
      bytesIn: number;
      bytesOut: number;
      packetsIn: number;
      packetsOut: number;
    }>;
  };
  uptime: number;
}

export interface AuditLog {
  _id?: ObjectId;
  timestamp: Date;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

// ===== USER MANAGEMENT SCHEMAS =====
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  enabled: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dashboardLayout?: Record<string, any>;
  };
}

export interface Session {
  _id?: ObjectId;
  userId: ObjectId;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  active: boolean;
}

// ===== CONFIGURATION SCHEMAS =====
export interface SystemConfig {
  _id?: ObjectId;
  category: string;
  key: string;
  value: any;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  encrypted: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// ===== EXPORT TYPES =====
export type Collections = {
  firewall_rules: FirewallRule;
  firewall_stats: FirewallStats;
  network_connections: NetworkConnection;
  network_traffic: NetworkTraffic;
  network_stats: NetworkStats;
  threat_events: ThreatEvent;
  threat_stats: ThreatStats;
  applications: Application;
  application_policies: ApplicationPolicy;
  web_filter_categories: WebFilterCategory;
  blocked_sites: BlockedSite;
  web_filter_policies: WebFilterPolicy;
  vpn_tunnels: VpnTunnel;
  vpn_users: VpnUser;
  vpn_settings: VpnSettings;
  system_stats: SystemStats;
  audit_logs: AuditLog;
  users: User;
  sessions: Session;
  system_config: SystemConfig;
};
