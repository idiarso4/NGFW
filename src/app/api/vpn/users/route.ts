// API Route: /api/vpn/users
import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/mongodb/client';

// GET /api/vpn/users - Get VPN users
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB - REQUIRED (NO FALLBACK)
    await ensureConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // TODO: Implement VPN user repository
    // For now, return empty data structure that requires database
    const users: any[] = [];
    const stats = {
      total: 0,
      connected: 0,
      disconnected: 0,
      disabled: 0,
      totalBandwidth: 0,
      averageSessionDuration: 0,
      byGroup: []
    };

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
        stats,
      },
      message: 'VPN users from database (requires implementation)'
    });

  } catch (error) {
    console.error('Error fetching VPN users:', error);
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
