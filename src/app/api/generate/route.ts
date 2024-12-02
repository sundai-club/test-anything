import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is missing or empty' },
        { status: 400 }
      );
    }

    const prompt = `You are a helpful AI that generates multiple choice questions. 
Please generate 5 unique multiple-choice questions based on the following text.
Return the response in JSON format with an array of questions.

Text to analyze:
"""
${text}
"""

Please format your response as a JSON object with a "questions" array containing objects with the following structure:
{
  "questions": [
    {
      "id": 1,
      "question": "What is being asked?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "The correct option",
      "hint": "A helpful hint about the answer 💡"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(response);
    const questions = parsedResponse.questions || [];

    // Create a new quiz record
    const quiz = await prisma.quiz.create({
      data: {
        text,
        questions: JSON.stringify(questions),
        totalQuestions: questions.length,
        correctAnswers: 0,
        skippedQuestions: 0,
        timeSpent: 0,
      },
    });

    return NextResponse.json({ 
      questions,
      quizId: quiz.id 
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

// Add new endpoint to update quiz results
export async function PATCH(request: Request) {
  try {
    const { quizId, correctAnswers, skippedQuestions, timeSpent } = await request.json();

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        correctAnswers,
        skippedQuestions,
        timeSpent,
      },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz results' },
      { status: 500 }
    );
  }
} 