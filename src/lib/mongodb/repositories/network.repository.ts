// Network Repository - Data Access Layer
import { ObjectId, Filter, FindOptions } from 'mongodb';
import { mongoClient } from '../client';
import type { NetworkConnection, NetworkTraffic, NetworkStats } from '../schemas';

export class NetworkRepository {
  private get connectionsCollection() {
    return mongoClient.getCollection('network_connections');
  }

  private get trafficCollection() {
    return mongoClient.getCollection('network_traffic');
  }

  private get statsCollection() {
    return mongoClient.getCollection('network_stats');
  }

  // ===== NETWORK CONNECTIONS =====

  async createConnection(connection: Omit<NetworkConnection, '_id'>): Promise<NetworkConnection> {
    const result = await this.connectionsCollection.insertOne(connection);
    return { ...connection, _id: result.insertedId } as NetworkConnection;
  }

  async getConnections(
    filter: Filter<NetworkConnection> = {},
    options: FindOptions<NetworkConnection> = {}
  ): Promise<NetworkConnection[]> {
    const defaultOptions: FindOptions<NetworkConnection> = {
      sort: { timestamp: -1 },
      limit: 100,
      ...options,
    };

    return await this.connectionsCollection.find(filter, defaultOptions).toArray();
  }

  async getActiveConnections(): Promise<NetworkConnection[]> {
    return await this.connectionsCollection
      .find({ status: 'active' })
      .sort({ timestamp: -1 })
      .toArray();
  }

  async getConnectionById(id: string): Promise<NetworkConnection | null> {
    return await this.connectionsCollection.findOne({ _id: new ObjectId(id) });
  }

  async updateConnectionStatus(
    sessionId: string,
    status: 'active' | 'closed' | 'timeout' | 'blocked',
    bytesIn?: number,
    bytesOut?: number
  ): Promise<boolean> {
    const updateData: any = { status };
    if (bytesIn !== undefined) updateData.bytesIn = bytesIn;
    if (bytesOut !== undefined) updateData.bytesOut = bytesOut;

    const result = await this.connectionsCollection.updateOne(
      { sessionId },
      { $set: updateData }
    );

    return result.modifiedCount > 0;
  }

  async closeConnection(sessionId: string): Promise<boolean> {
    return await this.updateConnectionStatus(sessionId, 'closed');
  }

  // ===== NETWORK TRAFFIC =====

  async recordTraffic(traffic: Omit<NetworkTraffic, '_id'>): Promise<NetworkTraffic> {
    const result = await this.trafficCollection.insertOne(traffic);
    return { ...traffic, _id: result.insertedId } as NetworkTraffic;
  }

  async getTrafficHistory(
    hours: number = 24,
    networkInterface?: string
  ): Promise<NetworkTraffic[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const filter: Filter<NetworkTraffic> = { timestamp: { $gte: since } };

    if (networkInterface) {
      filter.interface = networkInterface;
    }

    return await this.trafficCollection
      .find(filter)
      .sort({ timestamp: 1 })
      .toArray();
  }

  async getLatestTraffic(networkInterface?: string): Promise<NetworkTraffic | null> {
    const filter: Filter<NetworkTraffic> = {};
    if (networkInterface) {
      filter.interface = networkInterface;
    }

    return await this.trafficCollection
      .findOne(filter, { sort: { timestamp: -1 } });
  }

  // ===== NETWORK STATISTICS =====

  async saveStats(stats: Omit<NetworkStats, '_id'>): Promise<NetworkStats> {
    const result = await this.statsCollection.insertOne(stats);
    return { ...stats, _id: result.insertedId } as NetworkStats;
  }

  async getLatestStats(): Promise<NetworkStats | null> {
    return await this.statsCollection
      .findOne({}, { sort: { timestamp: -1 } });
  }

  async getStatsHistory(hours: number = 24): Promise<NetworkStats[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await this.statsCollection
      .find(
        { timestamp: { $gte: since } },
        { sort: { timestamp: 1 } }
      )
      .toArray();
  }

  // ===== ANALYTICS =====

  async getConnectionStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    blocked: number;
    byProtocol: Array<{ protocol: string; count: number }>;
    byApplication: Array<{ application: string; count: number }>;
  }> {
    const pipeline = [
      {
        $facet: {
          statusStats: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          protocolStats: [
            {
              $group: {
                _id: '$protocol',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          applicationStats: [
            {
              $match: { application: { $exists: true, $ne: null } }
            },
            {
              $group: {
                _id: '$application',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ];

    const result = await this.connectionsCollection.aggregate(pipeline).toArray();
    const data = result[0] as any;

    const statusMap = new Map(data.statusStats.map((s: any) => [s._id, s.count]));
    
    return {
      total: data.statusStats.reduce((sum: number, s: any) => sum + s.count, 0),
      active: statusMap.get('active') || 0,
      closed: statusMap.get('closed') || 0,
      blocked: statusMap.get('blocked') || 0,
      byProtocol: data.protocolStats.map((p: any) => ({
        protocol: p._id,
        count: p.count
      })),
      byApplication: data.applicationStats.map((a: any) => ({
        application: a._id,
        count: a.count
      }))
    };
  }

  async getTopUsers(limit: number = 10): Promise<Array<{
    user: string;
    connections: number;
    bandwidth: number;
  }>> {
    const pipeline = [
      {
        $match: { user: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$user',
          connections: { $sum: 1 },
          bandwidth: { $sum: { $add: ['$bytesIn', '$bytesOut'] } }
        }
      },
      { $sort: { bandwidth: -1 } },
      { $limit: limit }
    ];

    const result = await this.connectionsCollection.aggregate(pipeline).toArray();
    return result.map((r: any) => ({
      user: r._id,
      connections: r.connections,
      bandwidth: r.bandwidth
    }));
  }

  async getBandwidthByApplication(limit: number = 10): Promise<Array<{
    application: string;
    bandwidth: number;
    connections: number;
  }>> {
    const pipeline = [
      {
        $match: { application: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$application',
          bandwidth: { $sum: { $add: ['$bytesIn', '$bytesOut'] } },
          connections: { $sum: 1 }
        }
      },
      { $sort: { bandwidth: -1 } },
      { $limit: limit }
    ];

    const result = await this.connectionsCollection.aggregate(pipeline).toArray();
    return result.map((r: any) => ({
      application: r._id,
      bandwidth: r.bandwidth,
      connections: r.connections
    }));
  }

  // ===== SEARCH & FILTERING =====

  async searchConnections(
    searchQuery: string,
    filters: {
      status?: 'active' | 'closed' | 'timeout' | 'blocked';
      protocol?: 'TCP' | 'UDP' | 'ICMP';
      application?: string;
      user?: string;
      dateRange?: { start: Date; end: Date };
    } = {}
  ): Promise<NetworkConnection[]> {
    const query: Filter<NetworkConnection> = {};

    // Search in IP addresses and applications
    if (searchQuery) {
      query.$or = [
        { sourceIp: { $regex: searchQuery, $options: 'i' } },
        { destinationIp: { $regex: searchQuery, $options: 'i' } },
        { application: { $regex: searchQuery, $options: 'i' } },
        { user: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.protocol) query.protocol = filters.protocol;
    if (filters.application) query.application = filters.application;
    if (filters.user) query.user = filters.user;
    
    if (filters.dateRange) {
      query.timestamp = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return await this.connectionsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(1000)
      .toArray();
  }

  // ===== CLEANUP METHODS =====

  async cleanupOldConnections(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.connectionsCollection.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }

  async cleanupOldTraffic(daysToKeep: number = 7): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.trafficCollection.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }

  async cleanupOldStats(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.statsCollection.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }
}

// Export singleton instance
export const networkRepository = new NetworkRepository();
