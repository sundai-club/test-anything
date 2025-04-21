import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // A simple query to check if the database connection works
    const dbStatus = await prisma.$queryRaw`SELECT 1 as connected`;
    
    // Get the current database URL (with password masked)
    const dbUrl = process.env.DATABASE_URL || 'Not set';
    const maskedDbUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    
    return NextResponse.json({ 
      status: 'connected', 
      message: 'Database connection successful',
      dbUrl: maskedDbUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Get the current database URL (with password masked)
    const dbUrl = process.env.DATABASE_URL || 'Not set';
    const maskedDbUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown database error',
      dbUrl: maskedDbUrl,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
