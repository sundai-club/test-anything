'use client';
import { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';
import TextInput from '@/components/TextInput';
import ProgressBar from '@/components/ProgressBar';
import CompletionScreen from '@/components/CompletionScreen';
import type { Question } from '@/types';

// Sample texts for suggested topics
const SUGGESTED_TOPICS = {
  'Artificial Intelligence': `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals and humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.`,
  
  'MIT History': `The Massachusetts Institute of Technology (MIT) is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a key role in the development of modern technology and science. The Institute is traditionally known for its research and education in the physical sciences and engineering, but more recently in biology, economics, linguistics, and management as well. MIT is often ranked among the world's top academic institutions. The Institute is a member of the Association of American Universities (AAU) and has a strong entrepreneurial culture that has seen many alumni found notable companies.`,
  
  'Climate Change': `Climate change refers to long-term shifts in global or regional weather patterns. Since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane.`,
} as const;

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
        {currentStep === 'input' ? (
          <>
            <header className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-gray-900">
                TestMeAnything 🧠
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Transform any text into an interactive quiz using AI. Perfect for studying, 
                learning new topics, or testing your knowledge!
              </p>
            </header>

            <div className="space-y-6">
              <TextInput 
                onSubmit={handleQuestionsGenerated} 
                suggestedTopics={SUGGESTED_TOPICS}
              />
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  How it works ✨
                </h2>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium">1</span>
                    Paste any text or choose a topic
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium">2</span>
                    AI generates relevant questions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium">3</span>
                    Answer questions and get instant feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium">4</span>
                    Review your performance
                  </li>
                </ol>
              </div>
            </div>
          </>
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
