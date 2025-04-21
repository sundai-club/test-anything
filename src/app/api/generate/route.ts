import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, userId } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is missing or empty' },
        { status: 400 }
      );
    }

    // First, get a name for the quiz
    const namePrompt = `Create a concise, engaging title (maximum 40 characters) for a quiz based on the following content.
    The title should clearly reflect the main subject matter and be appealing to learners.
    Return ONLY the title text, nothing else:
    
    ${text.substring(0, 800)}...`;

    const nameCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: namePrompt }],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 60
    });

    const quizName = nameCompletion.choices[0].message.content?.trim() || 'Untitled Quiz';

    // Then generate questions as before
    const questionsPrompt = `You are an expert educator creating high-quality quiz questions to test understanding of important concepts.
    
    Generate 10 multiple-choice questions based on the following text. Focus ONLY on the key concepts, important facts, and meaningful insights from the content.
    
    IMPORTANT GUIDELINES:
    1. DO NOT ask about superficial details like page numbers, document length, or formatting.
    2. DO NOT create questions about the author, publication date, or other metadata unless it's central to understanding the content.
    3. Focus on testing comprehension of the main ideas, critical thinking, and application of concepts.
    4. Ensure questions are diverse in difficulty (easy, medium, hard) and cover different aspects of the content.
    5. Make sure all questions are directly relevant to the source material.
    6. Create plausible but clearly incorrect distractors for multiple-choice options.
    7. Provide helpful hints that guide thinking without giving away the answer.
    
    Text to analyze:
    """
    ${text}
    """
    
    Return your response as a JSON object with this exact structure:
    {
      "questions": [
        {
          "id": 1,
          "question": "A clear, concise question about an important concept?",
          "options": ["Plausible wrong answer", "Correct answer", "Plausible wrong answer", "Plausible wrong answer"],
          "correctAnswer": "Correct answer",
          "hint": "A helpful hint that guides thinking without giving away the answer 💡"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: questionsPrompt }],
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

    // Create a new quiz record with the name and associate it with the user
    const quiz = await prisma.quiz.create({
      data: {
        name: quizName,
        text,
        questions: JSON.stringify(questions),
        totalQuestions: questions.length,
        correctAnswers: 0,
        skippedQuestions: 0,
        timeSpent: 0,
        userId, // Associate quiz with user
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

// Add PATCH method to update quiz stats
export async function PATCH(request: Request) {
  try {
    const { quizId, correctAnswers, skippedQuestions, timeSpent } = await request.json();

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    // Update the quiz with completion stats
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        timesCompleted: { increment: 1 },
        totalScore: { increment: correctAnswers },
        // You can add more stats as needed
      },
    });

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz stats:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz stats' },
      { status: 500 }
    );
  }
}