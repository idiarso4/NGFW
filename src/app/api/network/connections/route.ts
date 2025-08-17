// API Route: /api/network/connections
import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/mongodb/client';
import { NetworkRepository } from '@/lib/mongodb/repositories/network.repository';

// GET /api/network/connections - Get network connections
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB - REQUIRED (NO FALLBACK)
    await ensureConnection();
    const networkRepo = new NetworkRepository();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || undefined;
    const protocol = searchParams.get('protocol') || undefined;

    // Get connections from database
    const connections = await networkRepo.getConnections({
      page,
      limit,
      status: status as any,
      protocol: protocol as any
    });

    const totalConnections = await networkRepo.getTotalConnections();

    // Calculate basic stats
    const stats = {
      total: totalConnections,
      active: 0,
      blocked: 0,
      topApplications: [],
      topUsers: []
    };

    return NextResponse.json({
      success: true,
      data: {
        connections,
        stats,
        pagination: {
          page,
          limit,
          total: totalConnections,
          pages: Math.ceil(totalConnections / limit),
        },
      },
    });

  } catch (error) {
    console.error('Error fetching network connections:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection required. Please configure your database.',
        message: error instanceof Error ? error.message : 'Unknown error',
        requiresDatabase: true,
      },
      { status: 503 } // Service Unavailable
    );
  }
}
