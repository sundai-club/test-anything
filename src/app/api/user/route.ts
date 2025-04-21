import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  console.log('GET /api/user - Request received');
  const { userId } = await auth();
  console.log('Auth completed, userId:', userId);

  if (!userId) {
    console.log('No userId found, returning 401');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Finding user with clerkId:', userId);
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    
    console.log('User found:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
} 