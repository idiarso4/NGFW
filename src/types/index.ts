// Common types for the NGFW Dashboard application

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface FirewallRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  priority: number;
  source: NetworkAddress;
  destination: NetworkAddress;
  service: Service;
  action: RuleAction;
  schedule?: Schedule;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type RuleAction = 'allow' | 'deny' | 'drop';

export interface NetworkAddress {
  type: 'any' | 'single' | 'range' | 'subnet' | 'group';
  value: string;
  description?: string;
}

export interface Service {
  type: 'any' | 'tcp' | 'udp' | 'icmp' | 'custom';
  ports?: string;
  protocol?: string;
}

export interface Schedule {
  type: 'always' | 'recurring' | 'onetime';
  startTime?: string;
  endTime?: string;
  days?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: ThreatType;
  severity: ThreatSeverity;
  source: string;
  destination: string;
  description: string;
  signature: string;
  action: string;
  blocked: boolean;
  details?: Record<string, any>;
}

export type ThreatType = 'malware' | 'intrusion' | 'botnet' | 'phishing' | 'spam' | 'vulnerability';
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface NetworkConnection {
  id: string;
  timestamp: Date;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: string;
  application?: string;
  user?: string;
  bytesIn: number;
  bytesOut: number;
  duration: number;
  status: ConnectionStatus;
}

export type ConnectionStatus = 'active' | 'closed' | 'timeout' | 'blocked';

export interface TrafficData {
  timestamp: Date;
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  connections: number;
}

export interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUtilization: number;
  activeConnections: number;
  threatsBlocked: number;
}

export interface Dashboard {
  totalThreatsBlocked: number;
  activeConnections: number;
  bandwidthUsage: {
    in: number;
    out: number;
  };
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
  recentThreats: ThreatEvent[];
  topApplications: ApplicationUsage[];
  trafficTrend: TrafficData[];
}

export interface ApplicationUsage {
  name: string;
  category: string;
  bytesTransferred: number;
  connections: number;
  users: number;
  risk: 'low' | 'medium' | 'high';
}

export interface VPNTunnel {
  id: string;
  name: string;
  type: 'site-to-site' | 'remote-access';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  localGateway: string;
  remoteGateway: string;
  encryption: string;
  bytesIn: number;
  bytesOut: number;
  connectedSince?: Date;
  lastActivity?: Date;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  schedule?: ReportSchedule;
  format: ReportFormat;
  recipients: string[];
  lastGenerated?: Date;
  nextGeneration?: Date;
  isActive: boolean;
}

export type ReportType = 'security' | 'traffic' | 'compliance' | 'custom';
export type ReportFormat = 'pdf' | 'csv' | 'excel' | 'html';

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  threatAlerts: boolean;
  systemAlerts: boolean;
  reportNotifications: boolean;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  dashboardLayout: string[];
}
