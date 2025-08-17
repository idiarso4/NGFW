// API Route: /api/database/setup
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// POST /api/database/setup - Setup database configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, config } = body;

    if (!type || !config) {
      return NextResponse.json({
        success: false,
        error: 'Database type and configuration are required'
      }, { status: 400 });
    }

    // Create environment variables content
    let envContent = '';
    
    if (type === 'local') {
      envContent = `# Local MongoDB Configuration
MONGODB_TYPE=local
MONGODB_LOCAL_URI=${config.uri || 'mongodb://localhost:27017'}
MONGODB_LOCAL_DB_NAME=${config.dbName || 'ngfw_dashboard_local'}

# MongoDB Atlas Configuration (unused)
MONGODB_ATLAS_URI=
MONGODB_ATLAS_DB_NAME=
`;
    } else if (type === 'atlas') {
      envContent = `# MongoDB Atlas Configuration
MONGODB_TYPE=atlas
MONGODB_ATLAS_URI=${config.uri}
MONGODB_ATLAS_DB_NAME=${config.dbName}

# Local MongoDB Configuration (unused)
MONGODB_LOCAL_URI=
MONGODB_LOCAL_DB_NAME=
`;
    }

    // Write to .env.local file
    const envPath = join(process.cwd(), '.env.local');
    
    try {
      await writeFile(envPath, envContent, 'utf8');
      
      return NextResponse.json({
        success: true,
        message: `Database configuration saved successfully. Please restart the application to apply changes.`,
        config: {
          type,
          ...config
        },
        nextSteps: [
          'Restart the Next.js development server',
          'Refresh the application',
          'Database connection will be active'
        ]
      });
      
    } catch (writeError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to write configuration file',
        message: writeError instanceof Error ? writeError.message : 'Unknown error',
        suggestion: 'Make sure the application has write permissions'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to setup database configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
