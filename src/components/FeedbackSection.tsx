'use client';
import React, { useState } from "react";
import { Question } from "@/types";

export default function FeedbackSection({
  questions,
}: {
  questions: Question[];
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'thumbs-up' | 'thumbs-down' | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (index: number, type: 'thumbs-up' | 'thumbs-down') => {
    setFeedback(prev => ({
      ...prev,
      [index]: prev[index] === type ? null : type
    }));
  };

  const handleSubmit = async () => {
    // Here you would typically send the feedback to your backend
    // For now, we'll just simulate a submission
    console.log('Submitting feedback:', feedback);
    
    // You could add an API call here:
    // await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ feedback, questions })
    // });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank you for your feedback!</h3>
        <p className="text-green-700">
          Your input helps us improve our question generation system.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {!showFeedback ? (
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium
                   transition-all duration-200 hover:bg-gray-200 hover:scale-102 active:scale-98"
        >
          Rate the Questions
        </button>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How were the questions?</h3>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve our AI-generated questions.
          </p>
          <ul className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <li key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-800 mb-2">{question.text || question.question}</p>
                <div className="flex space-x-3">
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
