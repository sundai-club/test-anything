import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Authentication error', 
      message: 'There was a problem with authentication. Please try logging in again.' 
    },
    { status: 401 }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      error: 'Authentication error', 
      message: 'There was a problem with authentication. Please try logging in again.' 
    },
    { status: 401 }
  );
}
