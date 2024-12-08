'use client';

const ANIMATION_DURATION = 25000;

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center space-y-4 p-8 bg-white/80 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2">
        {/* Brain animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          <div className="relative flex items-center justify-center w-16 h-16">
            <span className="text-4xl">🧠</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-[${ANIMATION_DURATION}ms] ease-linear w-0 animate-progress"
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-gray-700 font-medium">
          Analyzing your text...
        </div>
        
        {/* Loading steps */}
        <div className="text-sm text-gray-500 text-center max-w-xs">
          <div className="animate-fade-in-1">1. Reading content 📚</div>
          <div className="animate-fade-in-2">2. Understanding context 🤔</div>
          <div className="animate-fade-in-3">3. Generating questions ✍️</div>
          <div className="animate-fade-in-4">4. Almost there! 🎯</div>
        </div>
      </div>
    </div>
  );
} 