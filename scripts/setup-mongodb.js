#!/usr/bin/env node

/**
 * MongoDB Setup Script for NGFW Dashboard
 * 
 * This script initializes the MongoDB database with:
 * - Collections creation
 * - Indexes setup
 * - Sample data insertion
 * - User accounts creation
 * 
 * Usage: node scripts/setup-mongodb.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ngfw_dashboard';

async function setupMongoDB() {
  let client;

  try {
    console.log('🚀 Starting MongoDB setup...');
    console.log(`📍 Connecting to: ${MONGODB_URI}`);
    console.log(`📊 Database: ${DB_NAME}`);

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Create collections
    await createCollections(db);
    
    // Create indexes
    await createIndexes(db);
    
    // Insert sample data
    await insertSampleData(db);
    
    // Create admin user
    await createAdminUser(db);

    console.log('🎉 MongoDB setup completed successfully!');

  } catch (error) {
    console.error('❌ MongoDB setup failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('📝 Database connection closed');
    }
  }
}

async function createCollections(db) {
  console.log('\n📁 Creating collections...');

  const collections = [
    'firewall_rules',
    'firewall_stats',
    'network_connections',
    'network_traffic',
    'network_stats',
    'threat_events',
    'threat_stats',
    'applications',
    'application_policies',
    'web_filter_categories',
    'blocked_sites',
    'web_filter_policies',
    'vpn_tunnels',
    'vpn_users',
    'vpn_settings',
    'system_stats',
    'audit_logs',
    'users',
    'sessions',
    'system_config'
  ];

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName);
      console.log(`  ✅ Created collection: ${collectionName}`);
    } catch (error) {
      if (error.code === 48) {
        console.log(`  ⚠️  Collection already exists: ${collectionName}`);
      } else {
        console.error(`  ❌ Failed to create collection ${collectionName}:`, error.message);
      }
    }
  }
}

async function createIndexes(db) {
  console.log('\n🔍 Creating indexes...');

  const indexOperations = [
    // Firewall Rules
    {
      collection: 'firewall_rules',
      indexes: [
        { key: { enabled: 1 } },
        { key: { priority: -1 } },
        { key: { createdAt: -1 } },
        { key: { hitCount: -1 } },
        { key: { name: 'text', description: 'text' } }
      ]
    },
    
    // Network Connections
    {
      collection: 'network_connections',
      indexes: [
        { key: { timestamp: -1 } },
        { key: { sourceIp: 1 } },
        { key: { destinationIp: 1 } },
        { key: { status: 1 } },
        { key: { sessionId: 1 } }
      ]
    },
    
    // Threat Events
    {
      collection: 'threat_events',
      indexes: [
        { key: { timestamp: -1 } },
        { key: { severity: 1 } },
        { key: { type: 1 } },
        { key: { source: 1 } },
        { key: { blocked: 1 } }
      ]
    },
    
    // Users
    {
      collection: 'users',
      indexes: [
        { key: { username: 1 }, unique: true },
        { key: { email: 1 }, unique: true },
        { key: { enabled: 1 } }
      ]
    },
    
    // Sessions
    {
      collection: 'sessions',
      indexes: [
        { key: { sessionToken: 1 }, unique: true },
        { key: { userId: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
      ]
    }
  ];

  for (const { collection, indexes } of indexOperations) {
    try {
      await db.collection(collection).createIndexes(indexes);
      console.log(`  ✅ Created indexes for: ${collection}`);
    } catch (error) {
      console.error(`  ❌ Failed to create indexes for ${collection}:`, error.message);
    }
  }
}

async function insertSampleData(db) {
  console.log('\n📊 Inserting sample data...');

  // Sample Firewall Rules
  const sampleRules = [
    {
      name: 'Allow HTTP Traffic',
      description: 'Allow inbound HTTP traffic on port 80',
      enabled: true,
      priority: 100,
      source: { type: 'any', value: 'any' },
      destination: { type: 'any', value: 'any' },
      service: { protocol: 'tcp', ports: '80' },
      action: 'allow',
      logging: true,
      hitCount: 1250,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    },
    {
      name: 'Allow HTTPS Traffic',
      description: 'Allow inbound HTTPS traffic on port 443',
      enabled: true,
      priority: 90,
      source: { type: 'any', value: 'any' },
      destination: { type: 'any', value: 'any' },
      service: { protocol: 'tcp', ports: '443' },
      action: 'allow',
      logging: true,
      hitCount: 2340,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    },
    {
      name: 'Block Malicious IPs',
      description: 'Block traffic from known malicious IP ranges',
      enabled: true,
      priority: 95,
      source: { type: 'subnet', value: '192.168.100.0/24' },
      destination: { type: 'any', value: 'any' },
      service: { protocol: 'any', ports: 'any' },
      action: 'deny',
      logging: true,
      hitCount: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'security-team'
    }
  ];

  try {
    await db.collection('firewall_rules').insertMany(sampleRules);
    console.log(`  ✅ Inserted ${sampleRules.length} sample firewall rules`);
  } catch (error) {
    console.error('  ❌ Failed to insert sample firewall rules:', error.message);
  }

  // Sample System Config
  const systemConfig = [
    {
      category: 'general',
      key: 'app_name',
      value: 'NGFW Dashboard',
      description: 'Application name',
      type: 'string',
      encrypted: false,
      updatedAt: new Date(),
      updatedBy: 'system'
    },
    {
      category: 'security',
      key: 'session_timeout',
      value: 3600,
      description: 'Session timeout in seconds',
      type: 'number',
      encrypted: false,
      updatedAt: new Date(),
      updatedBy: 'admin'
    },
    {
      category: 'monitoring',
      key: 'data_retention_days',
      value: 90,
      description: 'Data retention period in days',
      type: 'number',
      encrypted: false,
      updatedAt: new Date(),
      updatedBy: 'admin'
    }
  ];

  try {
    await db.collection('system_config').insertMany(systemConfig);
    console.log(`  ✅ Inserted ${systemConfig.length} system configuration entries`);
  } catch (error) {
    console.error('  ❌ Failed to insert system config:', error.message);
  }
}

async function createAdminUser(db) {
  console.log('\n👤 Creating admin user...');

  const adminUser = {
    username: 'admin',
    email: 'admin@ngfw-dashboard.local',
    fullName: 'System Administrator',
    role: 'admin',
    permissions: ['*'],
    enabled: true,
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC'
    }
  };

  // Hash default password
  const defaultPassword = 'admin123';
  const saltRounds = 12;
  adminUser.passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  try {
    const existingUser = await db.collection('users').findOne({ username: 'admin' });
    
    if (existingUser) {
      console.log('  ⚠️  Admin user already exists');
    } else {
      await db.collection('users').insertOne(adminUser);
      console.log('  ✅ Admin user created successfully');
      console.log('  📝 Default credentials:');
      console.log('     Username: admin');
      console.log('     Password: admin123');
      console.log('  ⚠️  Please change the default password after first login!');
    }
  } catch (error) {
    console.error('  ❌ Failed to create admin user:', error.message);
  }
}

// Run the setup
if (require.main === module) {
  setupMongoDB();
}

module.exports = { setupMongoDB };
