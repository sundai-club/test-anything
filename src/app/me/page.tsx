'use client';
import { SignInButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useExtendedUser } from '@/providers/UserProvider';
import QuizCard from '@/components/QuizCard';

interface Quiz {
  id: string;
  name: string;
  createdAt: string;
  totalScore: number;
  totalQuestions: number;
  timesCompleted: number;
  correctAnswers: number;
  skippedQuestions: number;
  timeSpent: number;
  text: string;
  questions: string;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
        <p className="text-xl text-gray-700">Loading your quizzes...</p>
      </div>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center space-y-4">
        <p className="text-xl text-gray-700">Please sign in to view your quiz history.</p>
        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
}

function AccountInformation({ user }: { user: any }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">Name: {user.username || 'N/A'}</p>
    </div>
  );
}

function QuizHistory({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Quiz History</h1>
      {quizzes.length === 0 ? (
        <p className="text-lg text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
          You haven&apos;t created any quizzes yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function UserPage() {
  const { user } = useExtendedUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/quizzes/my`)
        .then((response) => response.json())
        .then((data) => {
          setQuizzes(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load quizzes');
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return <SignInPrompt />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-4 sm:p-8">
      <main className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
        <header className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Account</h1>
        </header>
        <AccountInformation user={user} />
        <QuizHistory quizzes={quizzes} />
      </main>
    </div>
  );
}