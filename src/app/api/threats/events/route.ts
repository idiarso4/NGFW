// API Route: /api/threats/events
import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/mongodb/client';
import { ThreatRepository } from '@/lib/mongodb/repositories/threat.repository';

// GET /api/threats/events - Get threat events
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB - REQUIRED (NO FALLBACK)
    await ensureConnection();
    const threatRepo = new ThreatRepository();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity') || undefined;
    const status = searchParams.get('status') || undefined;

    // Get threats from database
    const threats = await threatRepo.getThreats({
      page,
      limit,
      severity: severity as any,
      status: status as any
    });

    const totalThreats = await threatRepo.getTotalThreats();

    // Calculate basic analytics
    const analytics = {
      total: totalThreats,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byStatus: {
        active: 0,
        resolved: 0,
        investigating: 0
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        threats,
        analytics,
        pagination: {
          page,
          limit,
          total: totalThreats,
          pages: Math.ceil(totalThreats / limit),
        },
      },
    });

  } catch (error) {
    console.error('Error fetching threat events:', error);
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
