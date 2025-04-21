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
        
        // Check if data is an array and has items
        if (Array.isArray(data) && data.length > 0) {
          const sortedQuizzes = data
            .sort((a: Quiz, b: Quiz) => b.timesCompleted - a.timesCompleted)
            .slice(0, 10);
          setQuizzes(sortedQuizzes);
        } else if (data.error) {
          console.error('API returned an error:', data.error);
          setQuizzes([]);
        } else {
          // If data is not an array or is empty, set empty array
          console.log('No quizzes found or invalid data format');
          setQuizzes([]);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]);
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
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">
          No community quizzes available yet. Be the first to create one!
        </div>
      )}
    </div>
  );
} 