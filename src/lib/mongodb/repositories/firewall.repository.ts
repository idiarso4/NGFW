// Firewall Repository - Data Access Layer
import { ObjectId, Filter, UpdateFilter, FindOptions } from 'mongodb';
import { mongoClient } from '../client';
import type { FirewallRule, FirewallStats } from '../schemas';

export class FirewallRepository {
  private get collection() {
    return mongoClient.getCollection('firewall_rules');
  }

  private get statsCollection() {
    return mongoClient.getCollection('firewall_stats');
  }

  // ===== FIREWALL RULES CRUD =====
  
  async createRule(rule: Omit<FirewallRule, '_id'>): Promise<FirewallRule> {
    const now = new Date();
    const newRule: Omit<FirewallRule, '_id'> = {
      ...rule,
      hitCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(newRule);
    return { ...newRule, _id: result.insertedId } as FirewallRule;
  }

  async getRules(
    filter: Filter<FirewallRule> = {},
    options: FindOptions<FirewallRule> = {}
  ): Promise<FirewallRule[]> {
    const defaultOptions: FindOptions<FirewallRule> = {
      sort: { priority: -1, createdAt: -1 },
      ...options,
    };

    return await this.collection.find(filter, defaultOptions).toArray();
  }

  async getRuleById(id: string): Promise<FirewallRule | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async updateRule(
    id: string,
    update: UpdateFilter<FirewallRule>
  ): Promise<FirewallRule | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async deleteRule(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async bulkUpdateRules(
    ids: string[],
    update: UpdateFilter<FirewallRule>
  ): Promise<number> {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await this.collection.updateMany(
      { _id: { $in: objectIds } },
      {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount;
  }

  async bulkDeleteRules(ids: string[]): Promise<number> {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await this.collection.deleteMany({
      _id: { $in: objectIds }
    });

    return result.deletedCount;
  }

  // ===== RULE STATISTICS =====

  async incrementHitCount(ruleId: string): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(ruleId) },
      {
        $inc: { hitCount: 1 },
        $set: { lastHit: new Date() }
      }
    );
  }

  async getRuleStats(): Promise<{
    total: number;
    enabled: number;
    disabled: number;
    allowRules: number;
    denyRules: number;
    totalHits: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          enabled: {
            $sum: { $cond: [{ $eq: ['$enabled', true] }, 1, 0] }
          },
          disabled: {
            $sum: { $cond: [{ $eq: ['$enabled', false] }, 1, 0] }
          },
          allowRules: {
            $sum: { $cond: [{ $eq: ['$action', 'allow'] }, 1, 0] }
          },
          denyRules: {
            $sum: { $cond: [{ $in: ['$action', ['deny', 'drop']] }, 1, 0] }
          },
          totalHits: { $sum: '$hitCount' }
        }
      }
    ];

    const result = await this.collection.aggregate(pipeline).toArray();
    const stats = result[0] as any;
    return stats || {
      total: 0,
      enabled: 0,
      disabled: 0,
      allowRules: 0,
      denyRules: 0,
      totalHits: 0
    };
  }

  async getTopHitRules(limit: number = 10): Promise<Array<{
    _id: ObjectId;
    name: string;
    hitCount: number;
    lastHit?: Date;
  }>> {
    return await this.collection
      .find(
        { hitCount: { $gt: 0 } },
        {
          projection: { name: 1, hitCount: 1, lastHit: 1 },
          sort: { hitCount: -1 },
          limit
        }
      )
      .toArray();
  }

  // ===== SEARCH & FILTERING =====

  async searchRules(
    searchQuery: string,
    filters: {
      enabled?: boolean;
      action?: 'allow' | 'deny' | 'drop';
      priority?: { min?: number; max?: number };
    } = {}
  ): Promise<FirewallRule[]> {
    const query: Filter<FirewallRule> = {};

    // Text search
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Filters
    if (filters.enabled !== undefined) {
      query.enabled = filters.enabled;
    }

    if (filters.action) {
      query.action = filters.action;
    }

    if (filters.priority) {
      const priorityQuery: any = {};
      if (filters.priority.min !== undefined) {
        priorityQuery.$gte = filters.priority.min;
      }
      if (filters.priority.max !== undefined) {
        priorityQuery.$lte = filters.priority.max;
      }
      if (Object.keys(priorityQuery).length > 0) {
        query.priority = priorityQuery;
      }
    }

    return await this.collection
      .find(query)
      .sort({ priority: -1, createdAt: -1 })
      .toArray();
  }

  // ===== FIREWALL STATISTICS COLLECTION =====

  async saveStats(stats: Omit<FirewallStats, '_id'>): Promise<FirewallStats> {
    const result = await this.statsCollection.insertOne(stats);
    return { ...stats, _id: result.insertedId } as FirewallStats;
  }

  async getLatestStats(): Promise<FirewallStats | null> {
    return await this.statsCollection
      .findOne({}, { sort: { timestamp: -1 } });
  }

  async getStatsHistory(
    hours: number = 24
  ): Promise<FirewallStats[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await this.statsCollection
      .find(
        { timestamp: { $gte: since } },
        { sort: { timestamp: 1 } }
      )
      .toArray();
  }

  // ===== UTILITY METHODS =====

  async getNextPriority(): Promise<number> {
    const highestPriority = await this.collection
      .findOne({}, { sort: { priority: -1 }, projection: { priority: 1 } });
    
    return (highestPriority?.priority || 0) + 10;
  }

  async validateRuleConflicts(rule: Partial<FirewallRule>): Promise<FirewallRule[]> {
    // Find rules that might conflict with the new rule
    const conflicts = await this.collection
      .find({
        enabled: true,
        'source.value': rule.source?.value,
        'destination.value': rule.destination?.value,
        'service.protocol': rule.service?.protocol,
        'service.ports': rule.service?.ports,
      })
      .toArray();

    return conflicts;
  }

  async exportRules(): Promise<FirewallRule[]> {
    return await this.collection
      .find({}, { sort: { priority: -1 } })
      .toArray();
  }

  async importRules(rules: Omit<FirewallRule, '_id'>[]): Promise<number> {
    if (rules.length === 0) return 0;

    const now = new Date();
    const rulesWithTimestamps = rules.map(rule => ({
      ...rule,
      hitCount: 0,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await this.collection.insertMany(rulesWithTimestamps);
    return result.insertedCount;
  }

  // ===== CLEANUP METHODS =====

  async cleanupOldStats(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.statsCollection.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }
}

// Export singleton instance
export const firewallRepository = new FirewallRepository();
