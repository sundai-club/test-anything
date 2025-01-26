import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'; // Use server-side auth

export async function GET(request: Request) {
  const { userId: clerkUserId } = await auth(); // Get the user ID from Clerk

  if (!clerkUserId) {
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 401 }
    );
  }

  // Fetch the internal user ID using the Clerk user ID
  const userRecord = await prisma.user.findUnique({
    where: {
      clerkId: clerkUserId, // Assuming 'clerkId' is the field in your database
    },
    select: {
      id: true, // Select the internal DB ID
    },
  });

  if (!userRecord) {
    return NextResponse.json(
      { error: 'User not found in the database' },
      { status: 404 }
    );
  }

  const userId = userRecord.id; // Use the internal DB ID

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        text: true,
        totalQuestions: true,
        correctAnswers: true,
        createdAt: true,
        timesCompleted: true,
        totalScore: true,
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}