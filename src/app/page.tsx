'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import QuestionCard from '@/components/QuestionCard';
import TextInput from '@/components/TextInput';
import ProgressBar from '@/components/ProgressBar';

// Dummy questions for now
const dummyQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    hint: "This city is known as the City of Light 💡"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    hint: "Its color comes from iron oxide (rust) on its surface 🔴"
  },
  {
    id: 3,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Copper", "Gold", "Aluminum"],
    correctAnswer: "Gold",
    hint: "This precious metal has been valued since ancient times ✨"
  },
  {
    id: 4,
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Brain", "Liver", "Skin"],
    correctAnswer: "Skin",
    hint: "It covers your entire body and protects you from the environment 🧴"
  },
  {
    id: 5,
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Australia", "Indonesia", "Thailand"],
    correctAnswer: "Australia",
    hint: "This country is also known as the Land Down Under 🐨"
  },
  {
    id: 6,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    hint: "This Italian Renaissance polymath also designed flying machines ✏️"
  },
  {
    id: 7,
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: "Diamond",
    hint: "This gem is made of pure carbon under extreme pressure 💎"
  },
  {
    id: 8,
    question: "Which planet is known as the Morning Star?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctAnswer: "Venus",
    hint: "It's often visible in the early morning sky ⭐"
  },
  {
    id: 9,
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
    hint: "This city hosted the most recent Summer Olympics 🗼"
  },
  {
    id: 10,
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
    hint: "Plants use this gas for photosynthesis 🌱"
  },
  {
    id: 11,
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Gazelle", "Leopard"],
    correctAnswer: "Cheetah",
    hint: "This big cat can reach speeds of up to 70 mph 🐆"
  },
  {
    id: 12,
    question: "Which is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2",
    hint: "It's also the only even prime number 🔢"
  }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'input' | 'questions'>('input');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-8">
      <motion.main 
        className="max-w-3xl mx-auto space-y-8 animate-fadeIn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Learn Anything! 🚀
          </h1>
          <p className="text-gray-700">
            Paste your study material and get instant questions! ✨
          </p>
        </header>

        {currentStep === 'input' ? (
          <TextInput onSubmit={() => setCurrentStep('questions')} />
        ) : (
          <div className="space-y-6">
            <ProgressBar 
              current={currentQuestionIndex + 1} 
              total={dummyQuestions.length} 
            />
            <QuestionCard
              question={dummyQuestions[currentQuestionIndex]}
              onNext={() => {
                if (currentQuestionIndex < dummyQuestions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  setCurrentStep('input');
                  setCurrentQuestionIndex(0);
                }
              }}
              onSkip={() => {
                if (currentQuestionIndex < dummyQuestions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                }
              }}
            />
          </div>
        )}
      </motion.main>
    </div>
  );
}
