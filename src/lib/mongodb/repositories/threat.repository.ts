// Threat Repository - Data Access Layer
import { ObjectId, Filter, FindOptions } from 'mongodb';
import { mongoClient } from '../client';
import type { ThreatEvent, ThreatStats } from '../schemas';

export class ThreatRepository {
  private get eventsCollection() {
    return mongoClient.getCollection('threat_events');
  }

  private get statsCollection() {
    return mongoClient.getCollection('threat_stats');
  }

  // ===== THREAT EVENTS =====

  async createThreatEvent(event: Omit<ThreatEvent, '_id'>): Promise<ThreatEvent> {
    const result = await this.eventsCollection.insertOne(event);
    return { ...event, _id: result.insertedId } as ThreatEvent;
  }

  async getThreatEvents(
    filter: Filter<ThreatEvent> = {},
    options: FindOptions<ThreatEvent> = {}
  ): Promise<ThreatEvent[]> {
    const defaultOptions: FindOptions<ThreatEvent> = {
      sort: { timestamp: -1 },
      limit: 100,
      ...options,
    };

    return await this.eventsCollection.find(filter, defaultOptions).toArray();
  }

  async getThreatEventById(id: string): Promise<ThreatEvent | null> {
    return await this.eventsCollection.findOne({ _id: new ObjectId(id) });
  }

  async getRecentThreats(hours: number = 24): Promise<ThreatEvent[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await this.eventsCollection
      .find({ timestamp: { $gte: since } })
      .sort({ timestamp: -1 })
      .toArray();
  }

  async getCriticalThreats(): Promise<ThreatEvent[]> {
    return await this.eventsCollection
      .find({ severity: 'critical', resolved: false })
      .sort({ timestamp: -1 })
      .toArray();
  }

  async getUnresolvedThreats(): Promise<ThreatEvent[]> {
    return await this.eventsCollection
      .find({ resolved: false })
      .sort({ severity: 1, timestamp: -1 })
      .toArray();
  }

  async resolveThreat(
    id: string,
    resolvedBy: string,
    notes?: string
  ): Promise<boolean> {
    const result = await this.eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          resolved: true,
          resolvedBy,
          resolvedAt: new Date(),
          ...(notes && { notes })
        }
      }
    );

    return result.modifiedCount > 0;
  }

  async bulkResolveThreat(
    ids: string[],
    resolvedBy: string
  ): Promise<number> {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await this.eventsCollection.updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          resolved: true,
          resolvedBy,
          resolvedAt: new Date()
        }
      }
    );

    return result.modifiedCount;
  }

  // ===== THREAT STATISTICS =====

  async saveStats(stats: Omit<ThreatStats, '_id'>): Promise<ThreatStats> {
    const result = await this.statsCollection.insertOne(stats);
    return { ...stats, _id: result.insertedId } as ThreatStats;
  }

  async getLatestStats(): Promise<ThreatStats | null> {
    return await this.statsCollection
      .findOne({}, { sort: { timestamp: -1 } });
  }

  async getStatsHistory(hours: number = 24): Promise<ThreatStats[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await this.statsCollection
      .find(
        { timestamp: { $gte: since } },
        { sort: { timestamp: 1 } }
      )
      .toArray();
  }

  // ===== ANALYTICS =====

  async getThreatAnalytics(): Promise<{
    total: number;
    blocked: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolved: number;
    unresolved: number;
    byType: Array<{ type: string; count: number; percentage: number }>;
    bySeverity: Array<{ severity: string; count: number; percentage: number }>;
    topSources: Array<{ ip: string; country?: string; threats: number; blocked: number }>;
  }> {
    const pipeline = [
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
                resolved: { $sum: { $cond: ['$resolved', 1, 0] } }
              }
            }
          ],
          severityStats: [
            {
              $group: {
                _id: '$severity',
                count: { $sum: 1 }
              }
            }
          ],
          typeStats: [
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 }
              }
            }
          ],
          sourceStats: [
            {
              $group: {
                _id: '$source',
                threats: { $sum: 1 },
                blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
                country: { $first: '$details.country' }
              }
            },
            { $sort: { threats: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ];

    const result = await this.eventsCollection.aggregate(pipeline).toArray();
    const data = result[0] as any;

    const totalStats = data.totalStats[0] || { total: 0, blocked: 0, resolved: 0 };
    const total = totalStats.total;

    // Process severity stats
    const severityMap = new Map(data.severityStats.map((s: any) => [s._id, s.count]));
    const bySeverity = [
      { severity: 'critical', count: severityMap.get('critical') || 0, percentage: 0 },
      { severity: 'high', count: severityMap.get('high') || 0, percentage: 0 },
      { severity: 'medium', count: severityMap.get('medium') || 0, percentage: 0 },
      { severity: 'low', count: severityMap.get('low') || 0, percentage: 0 }
    ];

    // Calculate percentages
    bySeverity.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });

    // Process type stats
    const byType = data.typeStats.map((t: any) => ({
      type: t._id,
      count: t.count,
      percentage: total > 0 ? Math.round((t.count / total) * 100) : 0
    }));

    // Process source stats
    const topSources = data.sourceStats.map((s: any) => ({
      ip: s._id,
      country: s.country,
      threats: s.threats,
      blocked: s.blocked
    }));

    return {
      total,
      blocked: totalStats.blocked,
      critical: severityMap.get('critical') || 0,
      high: severityMap.get('high') || 0,
      medium: severityMap.get('medium') || 0,
      low: severityMap.get('low') || 0,
      resolved: totalStats.resolved,
      unresolved: total - totalStats.resolved,
      byType,
      bySeverity,
      topSources
    };
  }

  async getThreatTrends(days: number = 7): Promise<Array<{
    date: string;
    total: number;
    blocked: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          total: { $sum: 1 },
          blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const result = await this.eventsCollection.aggregate(pipeline).toArray();
    return result.map((r: any) => ({
      date: r._id,
      total: r.total,
      blocked: r.blocked,
      critical: r.critical,
      high: r.high,
      medium: r.medium,
      low: r.low
    }));
  }

  // ===== SEARCH & FILTERING =====

  async searchThreats(
    searchQuery: string,
    filters: {
      severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
      type?: 'malware' | 'intrusion' | 'botnet' | 'phishing' | 'vulnerability' | 'spam';
      blocked?: boolean;
      resolved?: boolean;
      dateRange?: { start: Date; end: Date };
    } = {}
  ): Promise<ThreatEvent[]> {
    const query: Filter<ThreatEvent> = {};

    // Text search
    if (searchQuery) {
      query.$or = [
        { source: { $regex: searchQuery, $options: 'i' } },
        { destination: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { signature: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Apply filters
    if (filters.severity) query.severity = filters.severity;
    if (filters.type) query.type = filters.type;
    if (filters.blocked !== undefined) query.blocked = filters.blocked;
    if (filters.resolved !== undefined) query.resolved = filters.resolved;
    
    if (filters.dateRange) {
      query.timestamp = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return await this.eventsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(1000)
      .toArray();
  }

  // ===== CLEANUP METHODS =====

  async cleanupOldThreats(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    // Only delete resolved threats older than cutoff date
    const result = await this.eventsCollection.deleteMany({
      timestamp: { $lt: cutoffDate },
      resolved: true
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

  // ===== EXPORT METHODS =====

  async exportThreats(
    filters: {
      dateRange?: { start: Date; end: Date };
      severity?: string[];
      resolved?: boolean;
    } = {}
  ): Promise<ThreatEvent[]> {
    const query: Filter<ThreatEvent> = {};

    if (filters.dateRange) {
      query.timestamp = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    if (filters.severity && filters.severity.length > 0) {
      query.severity = { $in: filters.severity };
    }

    if (filters.resolved !== undefined) {
      query.resolved = filters.resolved;
    }

    return await this.eventsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();
  }
}

// Export singleton instance
export const threatRepository = new ThreatRepository();
