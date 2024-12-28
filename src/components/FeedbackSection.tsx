'use client';
import React, { useState } from "react";
import { Question } from "@/types";

export default function FeedbackSection({ questions }: { questions: Question[] }) {
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (index: number, value: string) => {
    setFeedback((prev) => ({
        ...prev,
        [index]: prev[index] === value ? '' : value,
      }));      
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="mt-8 border-t pt-6">
      {submitted ? (
        <p className="text-center text-green-600 font-semibold">
          Your feedback has been submitted, thank you!
        </p>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            (Optional) Review and Rate Questions
          </h3>
          <ul className="space-y-4">
            {questions.map((questionObj, index) => (
              <li
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <p className="text-gray-800 font-medium mb-2">
                  <strong>Q{index + 1}:</strong> {questionObj.question}
                </p>
                <ul className="list-disc list-inside mb-3 text-gray-600">
                  {questionObj.options.map((option, optIndex) => (
                    <li key={optIndex}>
                      {option}
                      {option === questionObj.correctAnswer && (
                        <strong className="ml-1 text-green-700">
                          (Correct)
                        </strong>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFeedback(index, 'thumbs-up')}
                    className={`px-4 py-2 rounded-md border transition-colors
                    ${feedback[index] === 'thumbs-up'
                      ? 'bg-green-100 border-green-600 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback(index, 'thumbs-down')}
                    className={`px-4 py-2 rounded-md border transition-colors
                    ${feedback[index] === 'thumbs-down'
                      ? 'bg-red-100 border-red-600 text-red-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    👎
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold
                     transition-all duration-200 hover:bg-blue-600 hover:scale-102 active:scale-98"
            onClick={handleSubmit}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
