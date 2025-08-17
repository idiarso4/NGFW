// Database Configuration Manager
export interface DatabaseConfig {
  type: 'local' | 'atlas';
  uri: string;
  dbName: string;
  displayName: string;
  description: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastConnected?: Date;
  error?: string;
}

export const DATABASE_CONFIGS: Record<string, DatabaseConfig> = {
  local: {
    type: 'local',
    uri: process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_LOCAL_DB_NAME || 'ngfw_dashboard_local',
    displayName: 'Local MongoDB',
    description: 'MongoDB running on your local machine',
    status: 'disconnected'
  },
  atlas: {
    type: 'atlas',
    uri: process.env.MONGODB_ATLAS_URI || '',
    dbName: process.env.MONGODB_ATLAS_DB_NAME || 'ngfw_dashboard_cloud',
    displayName: 'MongoDB Atlas (Cloud)',
    description: 'MongoDB Atlas cloud database service',
    status: 'disconnected'
  }
};

export function getCurrentDatabaseConfig(): DatabaseConfig {
  const currentType = process.env.MONGODB_TYPE || 'local';
  return DATABASE_CONFIGS[currentType] || DATABASE_CONFIGS.local;
}

export function getDatabaseConfigByType(type: 'local' | 'atlas'): DatabaseConfig {
  return DATABASE_CONFIGS[type];
}

export function updateDatabaseConfig(type: 'local' | 'atlas', updates: Partial<DatabaseConfig>) {
  DATABASE_CONFIGS[type] = { ...DATABASE_CONFIGS[type], ...updates };
}

export function validateDatabaseConfig(config: DatabaseConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.uri) {
    errors.push('Database URI is required');
  }

  if (!config.dbName) {
    errors.push('Database name is required');
  }

  if (config.type === 'atlas') {
    if (!config.uri.includes('mongodb+srv://')) {
      errors.push('Atlas URI should use mongodb+srv:// format');
    }
    
    if (!config.uri.includes('@') || !config.uri.includes('.mongodb.net')) {
      errors.push('Invalid Atlas connection string format');
    }
  }

  if (config.type === 'local') {
    if (!config.uri.includes('mongodb://')) {
      errors.push('Local URI should use mongodb:// format');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
