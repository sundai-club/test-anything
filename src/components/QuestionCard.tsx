'use client';
import { useState } from 'react';

interface QuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    hint: string;
  };
  onAnswerSubmit: (isCorrect: boolean) => void;
  onSkip: () => void;
}

export default function QuestionCard({ question, onAnswerSubmit, onSkip }: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAnswerClick = (option: string) => {
    if (!hasSubmitted) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !hasSubmitted) {
      const isCorrect = selectedAnswer === question.correctAnswer;
      setHasSubmitted(true);
      // Wait a bit to show the result before moving to next question
      setTimeout(() => {
        onAnswerSubmit(isCorrect);
        setSelectedAnswer(null);
        setShowHint(false);
        setHasSubmitted(false);
      }, 1000);
    }
  };

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
                  ? hasSubmitted
                    ? option === question.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }
              ${!hasSubmitted ? 'hover:scale-[1.01] active:scale-[0.99]' : ''}
            `}
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {selectedAnswer && !hasSubmitted && (
          <button
            className="flex-1 py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg
                       transition-all duration-200 hover:bg-yellow-200"
            onClick={() => setShowHint(true)}
          >
            Show Hint 💡
          </button>
        )}
        <button
          className={`flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-lg
                     transition-all duration-200 ${!hasSubmitted && 'hover:bg-gray-200'}`}
          onClick={onSkip}
          disabled={hasSubmitted}
        >
          Skip ⏭️
        </button>
        {selectedAnswer && (
          <button
            className={`flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg
                       transition-all duration-200 ${!hasSubmitted && 'hover:bg-blue-600'}`}
            onClick={handleSubmit}
            disabled={hasSubmitted}
          >
            Submit ✅
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