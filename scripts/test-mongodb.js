#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * 
 * This script tests the MongoDB connection and displays database information.
 * 
 * Usage: node scripts/test-mongodb.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ngfw_dashboard';

async function testMongoDBConnection() {
  let client;

  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log(`📍 URI: ${MONGODB_URI}`);
    console.log(`📊 Database: ${DB_NAME}`);
    console.log('');

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');

    const db = client.db(DB_NAME);

    // Test database operations
    console.log('');
    console.log('🔍 Testing database operations...');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Get database stats
    try {
      const stats = await db.stats();
      console.log('');
      console.log('📊 Database Statistics:');
      console.log(`   - Collections: ${stats.collections}`);
      console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Indexes: ${stats.indexes}`);
      console.log(`   - Objects: ${stats.objects}`);
    } catch (error) {
      console.log('⚠️  Could not get database stats (this is normal for new databases)');
    }

    // Test a simple operation
    console.log('');
    console.log('🧪 Testing database operations...');
    
    const testCollection = db.collection('connection_test');
    
    // Insert test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test successful'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted successfully');
    
    // Read test document
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test document retrieved successfully');
    
    // Delete test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document deleted successfully');

    console.log('');
    console.log('🎉 MongoDB connection test completed successfully!');
    console.log('');
    console.log('✅ Your MongoDB setup is working correctly.');
    console.log('✅ You can now run: npm run db:setup');

  } catch (error) {
    console.error('');
    console.error('❌ MongoDB connection test failed!');
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔧 Connection refused. Please check:');
      console.error('   1. MongoDB is installed and running');
      console.error('   2. MongoDB service is started');
      console.error('   3. Connection URI is correct');
      console.error('');
      console.error('💡 To start MongoDB:');
      console.error('   - Windows: net start MongoDB');
      console.error('   - macOS: brew services start mongodb-community');
      console.error('   - Linux: sudo systemctl start mongod');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔧 Host not found. Please check:');
      console.error('   1. MongoDB URI is correct');
      console.error('   2. Network connectivity');
      console.error('   3. DNS resolution');
    } else {
      console.error('🔧 Error details:', error.message);
    }
    
    console.error('');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('📝 Database connection closed');
    }
  }
}

// Run the test
if (require.main === module) {
  testMongoDBConnection();
}

module.exports = { testMongoDBConnection };
