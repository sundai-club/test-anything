'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import CompletionScreen from '@/components/CompletionScreen';
import type { Question } from '@/types';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    skippedQuestions: 0,
    timeSpent: 0,
  });
  const [startTime] = useState<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Quiz not found');
        const data = await response.json();
        setQuestions(JSON.parse(data.questions));
        setStats(prev => ({ ...prev, totalQuestions: JSON.parse(data.questions).length }));
        setLoading(false);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
        setError(`Failed to load quiz: ${errorMessage}`);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [resolvedParams.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isComplete) {
        setStats(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const handleAnswerSubmit = async (isCorrect: boolean) => {
    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1
      }));
    }
    handleNext();
  };

  const handleSkip = () => {
    setStats(prev => ({
      ...prev,
      skippedQuestions: prev.skippedQuestions + 1
    }));
    handleNext();
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      try {
        await fetch('/api/generate', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: resolvedParams.id,
            ...stats,
          }),
        });
      } catch (error) {
        console.error('Failed to save results:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading quiz...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-8">
      <main className="max-w-3xl mx-auto space-y-8">
        {!isComplete ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={questions.length} 
              />
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Exit Quiz 🚪
              </button>
            </div>
            
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onSkip={handleSkip}
              onAnswerSubmit={handleAnswerSubmit}
            />

            <div className="text-center text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        ) : (
          <CompletionScreen
            stats={stats}
            onRestart={() => router.push('/')}
            quizId={resolvedParams.id}
          />
        )}
      </main>
    </div>
  );
} 