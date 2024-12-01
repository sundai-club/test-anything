'use client';
import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import TextInput from '@/components/TextInput';
import ProgressBar from '@/components/ProgressBar';
import CompletionScreen from '@/components/CompletionScreen';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

type AppState = 'input' | 'questions' | 'completion';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppState>('input');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    skippedQuestions: 0,
    timeSpent: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && currentStep === 'questions') {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, currentStep]);

  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setCurrentStep('questions');
    setStartTime(Date.now());
    setStats({
      totalQuestions: newQuestions.length,
      correctAnswers: 0,
      skippedQuestions: 0,
      timeSpent: 0,
    });
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('completion');
    }
  };

  const handleReset = () => {
    setCurrentStep('input');
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setStats({
      totalQuestions: 0,
      correctAnswers: 0,
      skippedQuestions: 0,
      timeSpent: 0,
    });
    setStartTime(null);
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
        ) : currentStep === 'questions' ? (
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
              onNext={handleNext}
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
            onRestart={handleReset}
          />
        )}
      </main>
    </div>
  );
}
