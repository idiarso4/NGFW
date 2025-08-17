// API Route: /api/database/test-connection
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// POST /api/database/test-connection - Test database connection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, config } = body;

    if (type === 'local') {
      // Test local MongoDB connection
      const uri = config?.uri || 'mongodb://localhost:27017';
      const dbName = config?.dbName || 'ngfw_dashboard_local';
      
      try {
        const client = new MongoClient(uri);
        await client.connect();
        
        // Test database access
        const db = client.db(dbName);
        await db.admin().ping();
        
        await client.close();
        
        return NextResponse.json({
          success: true,
          message: `Successfully connected to local MongoDB at ${uri}`,
          config: { uri, dbName }
        });
        
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: `Failed to connect to local MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestion: 'Make sure MongoDB is running on your local machine'
        });
      }
      
    } else if (type === 'atlas') {
      // Test MongoDB Atlas connection
      const { uri, dbName } = config;
      
      if (!uri || !dbName) {
        return NextResponse.json({
          success: false,
          error: 'MongoDB Atlas URI and database name are required',
          suggestion: 'Please provide a valid connection string and database name'
        });
      }
      
      try {
        const client = new MongoClient(uri);
        await client.connect();
        
        // Test database access
        const db = client.db(dbName);
        await db.admin().ping();
        
        await client.close();
        
        return NextResponse.json({
          success: true,
          message: `Successfully connected to MongoDB Atlas database: ${dbName}`,
          config: { uri, dbName }
        });
        
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: `Failed to connect to MongoDB Atlas: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestion: 'Check your connection string, network access, and database credentials'
        });
      }
      
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid database type. Must be "local" or "atlas"'
      });
    }

  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test database connection',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
