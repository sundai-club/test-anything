'use client';
import { useState, useCallback, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useExtendedUser } from '../providers/UserProvider';
import { useClerk } from '@clerk/clerk-react';

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
          className={`absolute h-full w-1/3 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            mode === 'url' ? 'translate-x-full' : 
            mode === 'pdf' ? 'translate-x-[200%]' : 
            'translate-x-0'
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
        <button
          onClick={() => onToggle('pdf')}
          className={`flex-1 px-4 py-2 rounded-full z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${
            mode === 'pdf' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-lg">📄</span>
          <span className="font-medium">PDF</span>
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

const MAX_CHARS = 100000; 

interface LoadingState {
  isLoading: boolean;
  wasTruncated: boolean;
}

// Add PDF.js type declaration
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function TextInput({ suggestedTopics }: TextInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [input, setInput] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [wasTruncated, setWasTruncated] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    wasTruncated: false
  });

  const [content, setContent] = useState('');
  const { user } = useExtendedUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    setInput('');
    setPdfFile(null);
    setError(null);
  }, [inputMode]);

  // Add useEffect to load PDF.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.min.js';
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const truncateText = (text: string) => {
    if (text.length > MAX_CHARS) {
      setLoadingState(prev => ({ ...prev, wasTruncated: true }));
      return text.slice(0, MAX_CHARS);
    }
    setLoadingState(prev => ({ ...prev, wasTruncated: false }));
    return text;
  };

  // Add new function for client-side PDF processing
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: { str: string }) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleSubmit = async () => {
    if (!user) {
      openSignIn(); // Open the Clerk sign-in modal
      return;
    }

    setLoadingState(prev => ({ ...prev, isLoading: true }));
    setError(null);

    try {
      let textToProcess = input;

      if (inputMode === 'pdf') {
        if (!pdfFile) throw new Error('No PDF file selected');
        textToProcess = await extractTextFromPDF(pdfFile);
        textToProcess = truncateText(textToProcess);
      } else if (inputMode === 'url') {
        if (input.toLowerCase().endsWith('.pdf')) {
          setError(
            'PDF URLs cannot be processed directly. Please:\n' +
            '1. Download the PDF to your computer\n' +
            '2. Switch to PDF mode using the toggle above\n' +
            '3. Upload the downloaded PDF file'
          );
          return;
        }

        try {
          const response = await fetch('/api/fetch-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: input }),
          });
        const urlToFetch = input.startsWith('http://') || input.startsWith('https://')
          ? input
          : `https://${input}`;

        const response = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlToFetch }),
        });
          const data = await response.json();

          if (!response.ok) {
            if (data.type === 'SCRAPING_BLOCKED') {
              setError(
                'This website does not allow content scraping. Please try one of these alternatives:\n' +
                '1. Generate a PDF of the page and upload it\n' +
                '2. Copy and paste the text content directly'
              );
              return;
            }
            throw new Error(data.error || 'Failed to fetch URL content');
          }

          textToProcess = data.content;
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch URL content');
          return;
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: textToProcess,
          wasTextTruncated: loadingState.wasTruncated,
          userId: user.id // Pass user ID to associate quiz
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      if (!data.quizId) {
        throw new Error('No quiz ID received from server');
      }

      router.push(`/quiz/${data.quizId}`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error in handleSubmit:', e);
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {loadingState.isLoading ? (
        <>
          {loadingState.wasTruncated && (
            <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
              ⚠️ The input was too long and has been truncated to {MAX_CHARS.toLocaleString()} characters for optimal processing.
            </div>
          )}
          <LoadingAnimation wasTruncated={loadingState.wasTruncated} />
        </>
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