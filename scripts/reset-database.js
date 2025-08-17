#!/usr/bin/env node

/**
 * MongoDB Database Reset Script for NGFW Dashboard
 * 
 * This script completely resets the database by:
 * - Dropping all collections
 * - Recreating collections and indexes
 * - Inserting fresh sample data
 * 
 * ⚠️  WARNING: This will delete ALL data in the database!
 * 
 * Usage: node scripts/reset-database.js
 */

const { MongoClient } = require('mongodb');
const { setupMongoDB } = require('./setup-mongodb');
const { seedDatabase } = require('./seed-data');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ngfw_dashboard';

async function resetDatabase() {
  let client;

  try {
    console.log('🔄 Starting database reset...');
    console.log(`📍 URI: ${MONGODB_URI}`);
    console.log(`📊 Database: ${DB_NAME}`);
    console.log('');
    console.log('⚠️  WARNING: This will delete ALL data in the database!');
    
    // In a real scenario, you might want to add a confirmation prompt here
    // For now, we'll proceed automatically
    
    console.log('⏳ Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Get list of existing collections
    console.log('\n🔍 Checking existing collections...');
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections`);

    if (collections.length > 0) {
      console.log('\n🗑️  Dropping existing collections...');
      
      for (const collection of collections) {
        try {
          await db.collection(collection.name).drop();
          console.log(`  ✅ Dropped collection: ${collection.name}`);
        } catch (error) {
          if (error.code === 26) {
            console.log(`  ⚠️  Collection ${collection.name} doesn't exist (already dropped)`);
          } else {
            console.error(`  ❌ Failed to drop collection ${collection.name}:`, error.message);
          }
        }
      }
    } else {
      console.log('  ℹ️  No collections to drop');
    }

    // Close the connection before running setup
    await client.close();
    console.log('📝 Closed database connection');

    console.log('\n🏗️  Setting up fresh database...');
    await setupMongoDB();

    console.log('\n🌱 Seeding with sample data...');
    await seedDatabase();

    console.log('\n🎉 Database reset completed successfully!');
    console.log('');
    console.log('✅ Your database has been completely reset with fresh data.');
    console.log('✅ You can now start the application with: npm run dev');
    console.log('');
    console.log('🔑 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('\n❌ Database reset failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('');
      console.error('🔧 Connection refused. Please check:');
      console.error('   1. MongoDB is installed and running');
      console.error('   2. MongoDB service is started');
      console.error('   3. Connection URI is correct');
    } else {
      console.error('🔧 Error details:', error.message);
    }
    
    process.exit(1);
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        // Ignore close errors
      }
    }
  }
}

// Confirmation function (for interactive use)
function askForConfirmation() {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Are you sure you want to reset the database? This will delete ALL data! (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

// Interactive reset function
async function interactiveReset() {
  console.log('🔄 MongoDB Database Reset');
  console.log('========================');
  console.log('');
  console.log('⚠️  This operation will:');
  console.log('   - Delete ALL existing data');
  console.log('   - Drop all collections');
  console.log('   - Recreate database structure');
  console.log('   - Insert fresh sample data');
  console.log('');

  const confirmed = await askForConfirmation();
  
  if (confirmed) {
    console.log('✅ Confirmed. Proceeding with database reset...');
    await resetDatabase();
  } else {
    console.log('❌ Reset cancelled by user.');
    process.exit(0);
  }
}

// Run the reset
if (require.main === module) {
  // Check if running with --force flag for non-interactive mode
  const args = process.argv.slice(2);
  const forceMode = args.includes('--force') || args.includes('-f');
  
  if (forceMode) {
    console.log('🚀 Running in force mode (non-interactive)');
    resetDatabase();
  } else {
    interactiveReset();
  }
}

module.exports = { resetDatabase };
