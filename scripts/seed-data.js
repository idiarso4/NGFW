#!/usr/bin/env node

/**
 * MongoDB Data Seeding Script for NGFW Dashboard
 * 
 * This script populates the database with realistic sample data for:
 * - Firewall rules
 * - Network connections
 * - Threat events
 * - Applications
 * - VPN tunnels and users
 * - System statistics
 * 
 * Usage: node scripts/seed-data.js
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ngfw_dashboard';

// Sample data generators
function generateFirewallRules(count = 50) {
  const rules = [];
  const actions = ['allow', 'deny', 'drop'];
  const protocols = ['tcp', 'udp', 'icmp', 'any'];
  const commonPorts = ['80', '443', '22', '21', '25', '53', '110', '143', '993', '995', 'any'];
  
  for (let i = 0; i < count; i++) {
    rules.push({
      name: `Rule ${i + 1} - ${['Web Traffic', 'SSH Access', 'Email', 'DNS', 'FTP', 'Database'][Math.floor(Math.random() * 6)]}`,
      description: `Auto-generated rule for ${['web access', 'remote management', 'email services', 'DNS resolution', 'file transfer', 'database access'][Math.floor(Math.random() * 6)]}`,
      enabled: Math.random() > 0.2, // 80% enabled
      priority: Math.floor(Math.random() * 100) + 1,
      source: {
        type: ['any', 'ip', 'subnet'][Math.floor(Math.random() * 3)],
        value: Math.random() > 0.5 ? 'any' : `192.168.${Math.floor(Math.random() * 255)}.0/24`
      },
      destination: {
        type: ['any', 'ip', 'subnet'][Math.floor(Math.random() * 3)],
        value: Math.random() > 0.5 ? 'any' : `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      service: {
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        ports: commonPorts[Math.floor(Math.random() * commonPorts.length)]
      },
      action: actions[Math.floor(Math.random() * actions.length)],
      logging: Math.random() > 0.3, // 70% with logging
      hitCount: Math.floor(Math.random() * 10000),
      lastHit: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdBy: ['admin', 'security-team', 'network-admin'][Math.floor(Math.random() * 3)]
    });
  }
  
  return rules;
}

function generateNetworkConnections(count = 200) {
  const connections = [];
  const protocols = ['TCP', 'UDP', 'ICMP'];
  const statuses = ['active', 'closed', 'timeout', 'blocked'];
  const applications = ['HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS', 'SMTP', 'POP3', 'IMAP', 'Skype', 'Teams'];
  const users = ['john.doe', 'jane.smith', 'mike.johnson', 'sarah.wilson', 'tom.brown', 'alice.davis'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    connections.push({
      timestamp,
      sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      sourcePort: Math.floor(Math.random() * 65535) + 1,
      destinationIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destinationPort: [80, 443, 22, 21, 25, 53, 110, 143][Math.floor(Math.random() * 8)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      application: Math.random() > 0.3 ? applications[Math.floor(Math.random() * applications.length)] : undefined,
      user: Math.random() > 0.4 ? users[Math.floor(Math.random() * users.length)] : undefined,
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 1000000),
      duration: Math.floor(Math.random() * 3600),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      country: ['US', 'UK', 'DE', 'FR', 'JP', 'SG', 'AU'][Math.floor(Math.random() * 7)],
      sessionId: `${timestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }
  
  return connections;
}

function generateThreatEvents(count = 100) {
  const threats = [];
  const types = ['malware', 'intrusion', 'botnet', 'phishing', 'vulnerability', 'spam'];
  const severities = ['critical', 'high', 'medium', 'low', 'info'];
  const actions = ['blocked', 'quarantined', 'logged', 'alerted'];
  const signatures = [
    'Trojan.Win32.Generic',
    'SQL Injection Attempt',
    'Botnet C&C Communication',
    'Phishing Email Detected',
    'CVE-2023-12345 Exploit',
    'Spam Email Pattern',
    'Port Scan Detected',
    'Brute Force Attack',
    'Malicious File Upload',
    'XSS Attempt Blocked'
  ];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const blocked = Math.random() > 0.3; // 70% blocked
    const resolved = Math.random() > 0.4; // 60% resolved
    
    threats.push({
      timestamp,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      description: `${signatures[Math.floor(Math.random() * signatures.length)]} detected from external source`,
      signature: signatures[Math.floor(Math.random() * signatures.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      blocked,
      details: {
        protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
        port: [80, 443, 22, 21, 25][Math.floor(Math.random() * 5)],
        size: Math.floor(Math.random() * 10000),
        country: ['CN', 'RU', 'US', 'BR', 'IN'][Math.floor(Math.random() * 5)]
      },
      resolved,
      resolvedBy: resolved ? ['admin', 'security-team'][Math.floor(Math.random() * 2)] : undefined,
      resolvedAt: resolved ? new Date(timestamp.getTime() + Math.random() * 24 * 60 * 60 * 1000) : undefined
    });
  }
  
  return threats;
}

function generateApplications(count = 30) {
  const apps = [];
  const categories = ['Web', 'Email', 'File Transfer', 'Remote Access', 'Database', 'Messaging', 'Media', 'Security'];
  const statuses = ['allowed', 'blocked', 'monitored', 'restricted'];
  const risks = ['low', 'medium', 'high', 'critical'];
  const appNames = [
    'Microsoft Teams', 'Slack', 'Zoom', 'Skype', 'WhatsApp', 'Telegram',
    'Chrome', 'Firefox', 'Edge', 'Safari',
    'Outlook', 'Gmail', 'Thunderbird',
    'FileZilla', 'WinSCP', 'Dropbox', 'Google Drive', 'OneDrive',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'SSH', 'RDP', 'VNC', 'TeamViewer',
    'Spotify', 'YouTube', 'Netflix', 'VLC'
  ];
  
  for (let i = 0; i < count && i < appNames.length; i++) {
    apps.push({
      name: appNames[i],
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `${appNames[i]} application for business use`,
      version: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      vendor: ['Microsoft', 'Google', 'Mozilla', 'Apple', 'Adobe', 'Oracle'][Math.floor(Math.random() * 6)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      risk: risks[Math.floor(Math.random() * risks.length)],
      users: Math.floor(Math.random() * 200) + 1,
      bandwidth: Math.floor(Math.random() * 1000000000), // bytes
      sessions: Math.floor(Math.random() * 1000) + 1,
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  return apps;
}

async function seedDatabase() {
  let client;

  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📍 Connecting to: ${MONGODB_URI}`);
    console.log(`📊 Database: ${DB_NAME}`);

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Generate and insert sample data
    console.log('\n📊 Generating sample data...');

    // Firewall Rules
    console.log('  🔥 Generating firewall rules...');
    const firewallRules = generateFirewallRules(50);
    await db.collection('firewall_rules').insertMany(firewallRules);
    console.log(`  ✅ Inserted ${firewallRules.length} firewall rules`);

    // Network Connections
    console.log('  🌐 Generating network connections...');
    const networkConnections = generateNetworkConnections(200);
    await db.collection('network_connections').insertMany(networkConnections);
    console.log(`  ✅ Inserted ${networkConnections.length} network connections`);

    // Threat Events
    console.log('  🚨 Generating threat events...');
    const threatEvents = generateThreatEvents(100);
    await db.collection('threat_events').insertMany(threatEvents);
    console.log(`  ✅ Inserted ${threatEvents.length} threat events`);

    // Applications
    console.log('  📱 Generating applications...');
    const applications = generateApplications(30);
    await db.collection('applications').insertMany(applications);
    console.log(`  ✅ Inserted ${applications.length} applications`);

    // Generate some statistics
    console.log('  📈 Generating statistics...');
    
    // Network stats
    const networkStats = {
      timestamp: new Date(),
      totalConnections: networkConnections.length,
      activeConnections: networkConnections.filter(c => c.status === 'active').length,
      blockedConnections: networkConnections.filter(c => c.status === 'blocked').length,
      totalBandwidth: networkConnections.reduce((sum, c) => sum + c.bytesIn + c.bytesOut, 0),
      inboundTraffic: networkConnections.reduce((sum, c) => sum + c.bytesIn, 0),
      outboundTraffic: networkConnections.reduce((sum, c) => sum + c.bytesOut, 0),
      topApplications: [],
      topUsers: []
    };
    await db.collection('network_stats').insertOne(networkStats);

    // Threat stats
    const threatStats = {
      timestamp: new Date(),
      totalThreats: threatEvents.length,
      blockedThreats: threatEvents.filter(t => t.blocked).length,
      criticalThreats: threatEvents.filter(t => t.severity === 'critical').length,
      highThreats: threatEvents.filter(t => t.severity === 'high').length,
      mediumThreats: threatEvents.filter(t => t.severity === 'medium').length,
      lowThreats: threatEvents.filter(t => t.severity === 'low').length,
      threatsByType: [],
      topSources: []
    };
    await db.collection('threat_stats').insertOne(threatStats);

    console.log('  ✅ Generated statistics');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${firewallRules.length} firewall rules`);
    console.log(`   - ${networkConnections.length} network connections`);
    console.log(`   - ${threatEvents.length} threat events`);
    console.log(`   - ${applications.length} applications`);
    console.log(`   - Statistics generated`);
    console.log('');
    console.log('🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('📝 Database connection closed');
    }
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
