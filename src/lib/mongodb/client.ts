// MongoDB Client Configuration for NGFW Dashboard
import { MongoClient, Db, Collection } from 'mongodb';
import type { Collections } from './schemas';

class MongoDBClient {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private static instance: MongoDBClient;

  private constructor() {}

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.client && this.db) {
      return; // Already connected
    }

    try {
      // Get database configuration based on type
      const dbType = process.env.MONGODB_TYPE || 'local';

      let uri: string;
      let dbName: string;

      if (dbType === 'atlas') {
        uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';
        dbName = process.env.MONGODB_ATLAS_DB_NAME || process.env.MONGODB_DB_NAME || 'ngfw_dashboard_cloud';

        if (!process.env.MONGODB_ATLAS_URI) {
          console.warn('⚠️  MONGODB_ATLAS_URI not configured, falling back to local MongoDB');
          uri = process.env.MONGODB_LOCAL_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';
          dbName = process.env.MONGODB_LOCAL_DB_NAME || process.env.MONGODB_DB_NAME || 'ngfw_dashboard_local';
        }
      } else {
        uri = process.env.MONGODB_LOCAL_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';
        dbName = process.env.MONGODB_LOCAL_DB_NAME || process.env.MONGODB_DB_NAME || 'ngfw_dashboard_local';
      }

      console.log(`🔗 Connecting to ${dbType === 'atlas' ? 'MongoDB Atlas' : 'Local MongoDB'}: ${dbName}`);

      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
      });

      await this.client.connect();
      this.db = this.client.db(dbName);

      console.log('✅ Connected to MongoDB successfully');
      
      // Create indexes for better performance
      await this.createIndexes();
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ Disconnected from MongoDB');
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public getCollection<T extends keyof Collections>(
    collectionName: T
  ): Collection<Collections[T]> {
    return this.getDb().collection<Collections[T]>(collectionName);
  }

  private async createIndexes(): Promise<void> {
    try {
      const db = this.getDb();

      // Firewall Rules indexes
      await db.collection('firewall_rules').createIndexes([
        { key: { enabled: 1 } },
        { key: { priority: -1 } },
        { key: { createdAt: -1 } },
        { key: { hitCount: -1 } },
        { key: { name: 'text', description: 'text' } },
      ]);

      // Network Connections indexes
      await db.collection('network_connections').createIndexes([
        { key: { timestamp: -1 } },
        { key: { sourceIp: 1 } },
        { key: { destinationIp: 1 } },
        { key: { status: 1 } },
        { key: { sessionId: 1 } },
        { key: { timestamp: -1, status: 1 } },
      ]);

      // Network Traffic indexes
      await db.collection('network_traffic').createIndexes([
        { key: { timestamp: -1 } },
        { key: { interface: 1, timestamp: -1 } },
      ]);

      // Threat Events indexes
      await db.collection('threat_events').createIndexes([
        { key: { timestamp: -1 } },
        { key: { severity: 1 } },
        { key: { type: 1 } },
        { key: { source: 1 } },
        { key: { blocked: 1 } },
        { key: { resolved: 1 } },
        { key: { timestamp: -1, severity: 1 } },
        { key: { signature: 'text', description: 'text' } },
      ]);

      // Applications indexes
      await db.collection('applications').createIndexes([
        { key: { name: 1 } },
        { key: { category: 1 } },
        { key: { status: 1 } },
        { key: { lastSeen: -1 } },
        { key: { name: 'text', description: 'text' } },
      ]);

      // Application Policies indexes
      await db.collection('application_policies').createIndexes([
        { key: { enabled: 1 } },
        { key: { priority: -1 } },
        { key: { scope: 1 } },
        { key: { createdAt: -1 } },
      ]);

      // Web Filter indexes
      await db.collection('blocked_sites').createIndexes([
        { key: { url: 1 } },
        { key: { category: 1 } },
        { key: { status: 1 } },
        { key: { lastAttempt: -1 } },
        { key: { attempts: -1 } },
        { key: { url: 'text', reason: 'text' } },
      ]);

      // VPN indexes
      await db.collection('vpn_tunnels').createIndexes([
        { key: { name: 1 } },
        { key: { status: 1 } },
        { key: { type: 1 } },
        { key: { lastConnected: -1 } },
      ]);

      await db.collection('vpn_users').createIndexes([
        { key: { username: 1 }, unique: true },
        { key: { email: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { lastLogin: -1 } },
        { key: { group: 1 } },
      ]);

      // System Stats indexes
      await db.collection('system_stats').createIndexes([
        { key: { timestamp: -1 } },
      ]);

      // Audit Logs indexes
      await db.collection('audit_logs').createIndexes([
        { key: { timestamp: -1 } },
        { key: { userId: 1, timestamp: -1 } },
        { key: { action: 1 } },
        { key: { resource: 1 } },
        { key: { success: 1 } },
      ]);

      // Users indexes
      await db.collection('users').createIndexes([
        { key: { username: 1 }, unique: true },
        { key: { email: 1 }, unique: true },
        { key: { enabled: 1 } },
        { key: { role: 1 } },
      ]);

      // Sessions indexes
      await db.collection('sessions').createIndexes([
        { key: { sessionToken: 1 }, unique: true },
        { key: { userId: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
        { key: { active: 1 } },
      ]);

      // System Config indexes
      await db.collection('system_config').createIndexes([
        { key: { category: 1, key: 1 }, unique: true },
      ]);

      console.log('✅ MongoDB indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      await this.getDb().admin().ping();
      return true;
    } catch (error) {
      console.error('❌ MongoDB health check failed:', error);
      return false;
    }
  }

  // Get database statistics
  public async getStats(): Promise<any> {
    try {
      const stats = await this.getDb().stats();
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const mongoClient = MongoDBClient.getInstance();

// Helper function to ensure connection
export async function ensureConnection(): Promise<void> {
  await mongoClient.connect();
}

// Helper function for graceful shutdown
export async function gracefulShutdown(): Promise<void> {
  await mongoClient.disconnect();
}

// Connection status
export function isConnected(): boolean {
  try {
    return mongoClient.getDb() !== null;
  } catch {
    return false;
  }
}
