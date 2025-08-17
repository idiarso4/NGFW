import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, Dashboard, ThreatEvent, NetworkConnection } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'auth-store' }
  )
);

// Dashboard Store
interface DashboardState {
  data: Dashboard | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  setData: (data: Dashboard) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      data: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      setData: (data) => set({ data, lastUpdated: new Date(), error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      refresh: () => {
        // This would typically trigger a data fetch
        set({ isLoading: true, error: null });
      },
    }),
    { name: 'dashboard-store' }
  )
);

// Threats Store
interface ThreatsState {
  threats: ThreatEvent[];
  isLoading: boolean;
  error: string | null;
  filters: {
    severity?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  setThreats: (threats: ThreatEvent[]) => void;
  addThreat: (threat: ThreatEvent) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<ThreatsState['filters']>) => void;
  clearFilters: () => void;
}

export const useThreatsStore = create<ThreatsState>()(
  devtools(
    (set, get) => ({
      threats: [],
      isLoading: false,
      error: null,
      filters: {},
      setThreats: (threats) => set({ threats, error: null }),
      addThreat: (threat) => set((state) => ({ 
        threats: [threat, ...state.threats].slice(0, 1000) // Keep only latest 1000
      })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      clearFilters: () => set({ filters: {} }),
    }),
    { name: 'threats-store' }
  )
);

// Network Connections Store
interface NetworkState {
  connections: NetworkConnection[];
  isLoading: boolean;
  error: string | null;
  filters: {
    protocol?: string;
    status?: string;
    sourceIp?: string;
    destinationIp?: string;
  };
  setConnections: (connections: NetworkConnection[]) => void;
  addConnection: (connection: NetworkConnection) => void;
  updateConnection: (id: string, updates: Partial<NetworkConnection>) => void;
  removeConnection: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<NetworkState['filters']>) => void;
  clearFilters: () => void;
}

export const useNetworkStore = create<NetworkState>()(
  devtools(
    (set, get) => ({
      connections: [],
      isLoading: false,
      error: null,
      filters: {},
      setConnections: (connections) => set({ connections, error: null }),
      addConnection: (connection) => set((state) => ({ 
        connections: [connection, ...state.connections].slice(0, 5000) // Keep only latest 5000
      })),
      updateConnection: (id, updates) => set((state) => ({
        connections: state.connections.map(conn => 
          conn.id === id ? { ...conn, ...updates } : conn
        )
      })),
      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(conn => conn.id !== id)
      })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      clearFilters: () => set({ filters: {} }),
    }),
    { name: 'network-store' }
  )
);

// UI Store for global UI state
interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarOpen: true,
        sidebarCollapsed: false,
        theme: 'system',
        notifications: [],
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        setTheme: (theme) => set({ theme }),
        addNotification: (notification) => set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // Keep only latest 50 notifications
        })),
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(notif => notif.id !== id),
        })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ 
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);
