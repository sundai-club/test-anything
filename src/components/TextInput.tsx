'use client';
import { useState } from 'react';

export default function TextInput({ onSubmit }: { onSubmit: () => void }) {
  const [text, setText] = useState('');

  return (
    <div className="space-y-4 animate-fadeIn">
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
        style={{ resize: 'vertical' }}
      />
      <button
        className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold
                   transition-all duration-200 hover:scale-102 active:scale-98 
                   hover:bg-blue-600"
        onClick={onSubmit}
      >
        Generate Questions 🎯
      </button>
    </div>
  );
} 