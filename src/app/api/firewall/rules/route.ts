// API Route: /api/firewall/rules
import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/mongodb/client';
import { FirewallRepository } from '@/lib/mongodb/repositories/firewall.repository';

// GET /api/firewall/rules - Get firewall rules
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB - REQUIRED (NO FALLBACK)
    await ensureConnection();
    const firewallRepo = new FirewallRepository();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || undefined;
    const action = searchParams.get('action') || undefined;
    
    // Get rules from database
    const rules = await firewallRepo.getRules({
      page,
      limit,
      status: status as any,
      action: action as any
    });
    
    const totalRules = await firewallRepo.getTotalRules();
    
    return NextResponse.json({
      success: true,
      data: {
        rules,
        pagination: {
          page,
          limit,
          total: totalRules,
          pages: Math.ceil(totalRules / limit),
        },
      },
    });

  } catch (error) {
    console.error('Error fetching firewall rules:', error);
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

// POST /api/firewall/rules - Create new firewall rule
export async function POST(request: NextRequest) {
  try {
    await ensureConnection();
    const firewallRepo = new FirewallRepository();
    
    const body = await request.json();
    const newRule = await firewallRepo.createRule(body);
    
    return NextResponse.json({
      success: true,
      data: newRule,
      message: 'Firewall rule created successfully'
    });

  } catch (error) {
    console.error('Error creating firewall rule:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection required. Please configure your database.',
        message: error instanceof Error ? error.message : 'Unknown error',
        requiresDatabase: true,
      },
      { status: 503 }
    );
  }
}
