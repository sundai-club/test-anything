'use client';
import { useState } from 'react';

interface QuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    hint: string;
  };
  onNext: () => void;
  onSkip: () => void;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

export default function QuestionCard({ question, onNext, onSkip }: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg animate-slideUp">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            className={`w-full p-3 text-left rounded-lg border transition-all duration-200
              ${
                selectedAnswer === option
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }
              hover:scale-[1.01] active:scale-[0.99]`}
            onClick={() => setSelectedAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {selectedAnswer && !isCorrect && (
          <button
            className="flex-1 py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg
                       transition-all duration-200 hover:bg-yellow-200"
            onClick={() => setShowHint(true)}
          >
            Show Hint 💡
          </button>
        )}
        <button
          className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-lg
                     transition-all duration-200 hover:bg-gray-200"
          onClick={onSkip}
        >
          Skip ⏭️
        </button>
        {selectedAnswer && (
          <button
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg
                       transition-all duration-200 hover:bg-blue-600"
            onClick={onNext}
          >
            Next ➡️
          </button>
        )}
      </div>

      {showHint && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg animate-fadeIn text-yellow-800">
          {question.hint}
        </div>
      )}
    </div>
  );
} 