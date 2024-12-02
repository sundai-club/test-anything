import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Quiz = {
  id: string;
  text: string;
  totalQuestions: number;
  correctAnswers: number;
  createdAt: string;
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
        setQuizzes(data);
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
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        Community Quizzes 
        <span className="text-sm font-normal text-gray-500">
          (Try quizzes from others!)
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => router.push(`/quiz/${quiz.id}`)}
            className="group relative bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <p className="text-gray-900 font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {quiz.text.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      📝 {quiz.totalQuestions} questions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      ⭐️ {Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100) || 0}% success
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                Created at: {new Date(quiz.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 