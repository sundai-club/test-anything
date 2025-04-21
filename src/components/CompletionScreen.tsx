'use client';
import FeedbackSection from './FeedbackSection';
import { useState } from 'react';
import type { Question } from '@/types';

interface CompletionStats {
  totalQuestions: number;
  correctAnswers: number;
  skippedQuestions: number;
  timeSpent: number; // in seconds
}

export default function CompletionScreen({ 
  stats, 
  onRestart,
  quizId,
  questions = []
}: { 
  stats: CompletionStats;
  onRestart: () => void;
  quizId?: string;
  questions?: Question[];
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const percentageCorrect = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  const minutes = Math.floor(stats.timeSpent / 60);
  const seconds = stats.timeSpent % 60;

  const handleShare = async () => {
    if (quizId) {
      const shareUrl = `${window.location.origin}/quiz/${quizId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Try this quiz!',
            text: `I just scored ${percentageCorrect}% on this quiz. Can you beat my score?`,
            url: shareUrl
          });
        } catch (error) {
          console.log('Error sharing:', error);
          // Fallback to copying to clipboard
          await navigator.clipboard.writeText(shareUrl);
          alert('Quiz link copied to clipboard!');
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareUrl);
        alert('Quiz link copied to clipboard!');
      }
    }
  };

  // Determine the emoji and message based on performance
  const getPerformanceDetails = () => {
    if (percentageCorrect >= 90) return { emoji: '🏆', message: 'Outstanding!' };
    if (percentageCorrect >= 70) return { emoji: '🌟', message: 'Great job!' };
    if (percentageCorrect >= 50) return { emoji: '👍', message: 'Good effort!' };
    return { emoji: '💪', message: 'Keep practicing!' };
  };

  const performance = getPerformanceDetails();

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-6xl animate-bounce">
            {performance.emoji}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {performance.message}
          </h2>
          <p className="text-gray-600">
            You&apos;ve completed the quiz! Here&apos;s how you did:
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 py-6">
          <div className="space-y-2">
            <div className="text-xl font-bold text-blue-600">
              {stats.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">
              Total Questions
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-green-600">
              {stats.correctAnswers}
            </div>
            <div className="text-sm text-gray-600">
              Correct Answers
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-yellow-600">
              {stats.skippedQuestions}
            </div>
            <div className="text-sm text-gray-600">
              Skipped
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-purple-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">
              Time Spent
            </div>
          </div>
        </div>

        {/* Updated Progress Circle */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-600 stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${percentageCorrect * 2.51327} 251.327`}
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="50"
              className="text-2xl font-bold"
              textAnchor="middle"
              dy="9"
              fill="#1a1a1a"  // Darker text color
            >
              {percentageCorrect}%
            </text>
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          {quizId && (
            <button
              onClick={handleShare}
              className="w-full py-3 px-6 bg-green-500 text-white rounded-lg font-semibold
                       transition-all duration-200 hover:bg-green-600 hover:scale-102 active:scale-98
                       mb-3"
            >
              Share Quiz 🔗
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold
                     transition-all duration-200 hover:bg-blue-600 hover:scale-102 active:scale-98"
          >
            Try Another Topic 🚀
          </button>
        </div>

        {/* Feedback Section */}
        {questions.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <FeedbackSection questions={questions} />
          </div>
        )}
      </div>
    </div>
  );
}