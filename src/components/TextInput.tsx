'use client';
import { useState, useCallback, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

import { Question } from '@/types';

interface TextInputProps {
  suggestedTopics: Record<string, string>;
}

type InputMode = 'text' | 'url' | 'pdf';

function ToggleSwitch({ mode, onToggle }: { 
  mode: InputMode;
  onToggle: (mode: InputMode) => void;
}) {
  return (
    <div className="inline-flex p-1 bg-gray-100 rounded-full shadow-inner">
      <div className="relative flex w-[300px]">
        {/* Background Slider */}
        <div
          className={`absolute h-full w-1/2 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            mode === 'url' ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Buttons */}
        <button
          onClick={() => onToggle('text')}
          className={`flex-1 px-4 py-2 rounded-full z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${
            mode === 'text' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-lg">📝</span>
          <span className="font-medium">Text</span>
        </button>
        <button
          onClick={() => onToggle('url')}
          className={`flex-1 px-4 py-2 rounded-full z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${
            mode === 'url' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-lg">🔗</span>
          <span className="font-medium">URL</span>
        </button>
      </div>
    </div>
  );
}

const SUGGESTED_LINKS = {
  'AI Wiki': 'https://en.wikipedia.org/wiki/Artificial_intelligence',
  'Climate Wiki': 'https://en.wikipedia.org/wiki/Climate_change',
  'Modern Dating': 'https://markmanson.net/guide-to-modern-dating'
} as const;

export default function TextInput({ suggestedTopics }: TextInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [input, setInput] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setInput('');
    setPdfFile(null);
    setError(null);
  }, [inputMode]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type === 'application/pdf') {
      setPdfFile(file);
      setInput(file.name); // Show filename in input
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    let textToProcess = input;

    if (inputMode === 'url') {
      // Prepend https:// if no protocol is specified
      const urlToFetch = input.startsWith('http://') || input.startsWith('https://')
        ? input
        : `https://${input}`;

      // Fetch content from URL
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToFetch }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL content');
      }

      const data = await response.json();
      textToProcess = data.content;
    } else if (inputMode === 'pdf') {
      if (!pdfFile) throw new Error('No PDF file selected');
      
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to parse PDF');
      const data = await response.json();
      textToProcess = data.content;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToProcess }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      router.push(`/quiz/${data.quizId}`);
    } catch (e) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <ToggleSwitch mode={inputMode} onToggle={setInputMode} />
          </div>

          <div className="space-y-2">
            {inputMode === 'text' ? (
              <textarea
                className="w-full h-48 p-4 rounded-lg shadow-lg 
                         border border-gray-300
                         bg-white text-gray-900 
                         text-base leading-relaxed
                         focus:ring-2 focus:ring-blue-400 focus:outline-none 
                         transition-all duration-200
                         placeholder:text-gray-500"
                placeholder="Paste your study material here... 📚"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : inputMode === 'url' ? (
              <input
                type="url"
                className="w-full p-4 rounded-lg shadow-lg 
                         border border-gray-300
                         bg-white text-gray-900 
                         text-base
                         focus:ring-2 focus:ring-blue-400 focus:outline-none 
                         transition-all duration-200
                         placeholder:text-gray-500"
                placeholder="Enter a URL to generate questions from... 🔗"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              <div
                {...getRootProps()}
                className={`w-full h-48 p-4 rounded-lg shadow-lg border border-gray-300 
                            bg-white hover:border-gray-400 transition-colors duration-200
                            flex flex-col items-center justify-center cursor-pointer
                            ${isDragActive ? 'border-blue-400 bg-blue-50' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-3">
                  {pdfFile ? (
                    <>
                      <span className="text-2xl" role="img" aria-label="PDF file">📄</span>
                      <div>
                        <p className="text-gray-700 font-medium">{pdfFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Click or drag to replace</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl" role="img" aria-label="Upload PDF">📄</span>
                      <div>
                        <p className="text-gray-700">Drop your PDF here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {inputMode === 'text' ? (
                Object.entries(suggestedTopics).map(([topic, content]) => (
                  <button
                    key={topic}
                    onClick={() => setInput(content)}
                    className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-full
                             border border-gray-300 hover:border-blue-400 
                             transition-colors duration-200
                             hover:bg-blue-50"
                  >
                    Try &ldquo;{topic}&rdquo; 📖
                  </button>
                ))
              ) : inputMode === 'url' ? (
                Object.entries(SUGGESTED_LINKS).map(([name, url]) => (
                  <button
                    key={name}
                    onClick={() => setInput(url)}
                    className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-full
                             border border-gray-300 hover:border-blue-400
                             transition-colors duration-200
                             hover:bg-blue-50
                             flex items-center gap-1"
                  >
                    <span className="text-blue-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.9 4.22c-.33-.34-.85-.34-1.18 0L8.05 7.89c-.33.34-.33.86 0 1.2.33.33.85.33 1.18 0l2.27-2.27v9.68c0 .46.37.83.83.83s.83-.37.83-.83V6.82l2.27 2.27c.33.33.85.33 1.18 0 .33-.34.33-.86 0-1.2l-3.72-3.67z"/>
                      </svg>
                    </span>
                    {name} 🌐
                  </button>
                ))
              ) : (
                Object.entries(SUGGESTED_LINKS).map(([name, url]) => (
                  <button
                    key={name}
                    onClick={() => setInput(url)}
                    className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-full
                             border border-gray-300 hover:border-blue-400
                             transition-colors duration-200
                             hover:bg-blue-50
                             flex items-center gap-1"
                  >
                    <span className="text-blue-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.9 4.22c-.33-.34-.85-.34-1.18 0L8.05 7.89c-.33.34-.33.86 0 1.2.33.33.85.33 1.18 0l2.27-2.27v9.68c0 .46.37.83.83.83s.83-.37.83-.83V6.82l2.27 2.27c.33.33.85.33 1.18 0 .33-.34.33-.86 0-1.2l-3.72-3.67z"/>
                      </svg>
                    </span>
                    {name} 🌐
                  </button>
                ))
              )}
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
            disabled={!input.trim()}
          >
            Generate Questions 🎯
          </button>
        </>
      )}
    </div>
  );
} 