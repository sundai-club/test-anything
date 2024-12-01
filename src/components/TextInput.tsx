'use client';
import { useState } from 'react';
import LoadingAnimation from './LoadingAnimation';

interface TextInputProps {
  onSubmit: (questions: any[]) => void;
  suggestedTopics: Record<string, string>;
}

export default function TextInput({ onSubmit, suggestedTopics }: TextInputProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      onSubmit(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="space-y-2">
            <textarea
              className="w-full h-48 p-4 rounded-lg shadow-lg 
                       border border-gray-300
                       bg-white text-gray-900 
                       text-base leading-relaxed
                       focus:ring-2 focus:ring-blue-400 focus:outline-none 
                       transition-all duration-200
                       placeholder:text-gray-500"
              placeholder="Paste your study material here... 📚"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {Object.entries(suggestedTopics).map(([topic, content]) => (
                <button
                  key={topic}
                  onClick={() => setText(content)}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-full
                           border border-gray-300 hover:border-blue-400 
                           transition-colors duration-200"
                >
                  Try "{topic}" 📖
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold
                     transition-all duration-200 hover:scale-102 active:scale-98 
                     hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            Generate Questions 🎯
          </button>
        </>
      )}
    </div>
  );
} 