import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user exists in the database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist, create a new user record
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get primary email
      const primaryEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      if (!primaryEmail) {
        return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      }

      // Create a new user in the database
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: primaryEmail,
          username: clerkUser.username || `user_${userId.substring(0, 8)}`,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching or creating user:', error);
    return NextResponse.json({ error: 'Failed to fetch or create user' }, { status: 500 });
  }
} 