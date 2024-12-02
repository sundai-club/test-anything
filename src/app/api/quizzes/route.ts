import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
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