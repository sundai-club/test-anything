'use client';
import { useState } from 'react';
import QuestionCard from '@/components/QuestionCard';
import TextInput from '@/components/TextInput';
import ProgressBar from '@/components/ProgressBar';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'input' | 'questions'>('input');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setCurrentStep('questions');
  };

  const handleReset = () => {
    setCurrentStep('input');
    setCurrentQuestionIndex(0);
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-8">
      <main className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Learn Anything! 🚀
          </h1>
          <p className="text-gray-700">
            Paste your study material and get instant questions! ✨
          </p>
        </header>

        {currentStep === 'input' ? (
          <TextInput onSubmit={handleQuestionsGenerated} />
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={questions.length} 
              />
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Start Over 🔄
              </button>
            </div>
            
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onNext={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  // Show completion message or reset
                  handleReset();
                }
              }}
              onSkip={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                }
              }}
            />

            <div className="text-center text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-700">
            No questions available. Please try generating some! 🎯
          </div>
        )}
      </main>
    </div>
  );
}
