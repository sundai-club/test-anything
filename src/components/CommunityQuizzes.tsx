'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizCard from './QuizCard';

type Quiz = {
  id: string;
  name: string;
  text: string;
  totalQuestions: number;
  correctAnswers: number;
  createdAt: string;
  timesCompleted: number;
  totalScore: number;
};

export default function CommunityQuizzes() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes');
        const data = await response.json();
        const sortedQuizzes = data
          .sort((a: Quiz, b: Quiz) => b.timesCompleted - a.timesCompleted)
          .slice(0, 10);
        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        Loading community quizzes...
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        Community Quizzes 
        <span className="text-sm font-normal text-gray-500">
          (Try quizzes from others!)
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
} 