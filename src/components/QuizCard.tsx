import { useRouter } from 'next/navigation';

type Quiz = {
  id: string;
  name: string;
  totalQuestions: number;
  timesCompleted: number;
  totalScore: number;
  createdAt: string;
};

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter();

  return (
    <div
      key={quiz.id}
      onClick={() => router.push(`/quiz/${quiz.id}`)}
      className="group relative bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-100"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {quiz.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              📝 {quiz.totalQuestions} questions
            </span>
            <span className="text-gray-300">•</span>
            {quiz.timesCompleted > 0 ? (
              <>
                <span className="flex items-center gap-1.5">
                  👥 {quiz.timesCompleted} {quiz.timesCompleted === 1 ? 'attempt' : 'attempts'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  ⭐️ {Math.round((quiz.totalScore / (quiz.timesCompleted * quiz.totalQuestions)) * 100)}% avg score
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                🆕 Be the first to try!
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
          <span className="text-gray-400">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
          <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Take Quiz →
          </span>
        </div>
      </div>
    </div>
  );
}