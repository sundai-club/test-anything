'use client';
import TextInput from '@/components/TextInput';
import CommunityQuizzes from '@/components/CommunityQuizzes';

// Sample texts for suggested topics
const SUGGESTED_TOPICS = {
  'Artificial Intelligence': `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals and humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.`,
  
  'MIT History': `The Massachusetts Institute of Technology (MIT) is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a key role in the development of modern technology and science. The Institute is traditionally known for its research and education in the physical sciences and engineering, but more recently in biology, economics, linguistics, and management as well. MIT is often ranked among the world's top academic institutions. The Institute is a member of the Association of American Universities (AAU) and has a strong entrepreneurial culture that has seen many alumni found notable companies.`,
  
  'Modern Dating': `Dating success is a complex journey rooted in self-discovery and personal growth, where individuals must transcend superficial dating advice and instead focus on developing a robust emotional foundation that attracts genuine, compatible partners; this involves a multifaceted approach of addressing personal neediness, cultivating self-worth, establishing clear boundaries, and understanding the nuanced interplay between emotional chemistry and lifestyle compatibility, while simultaneously working on holistic self-improvement across critical life domains such as physical and mental health, financial stability, career satisfaction, and personal values, ultimately recognizing that attracting the right romantic partner is less about employing tactical dating strategies or performing specific behaviors and more about authentically expressing oneself, maintaining emotional independence, taking responsibility for one's own growth and well-being, learning to recognize and respect personal and potential partner's boundaries, understanding one's attachment style and emotional needs, differentiating between fleeting attraction and meaningful connection, investing in personal development that makes one genuinely interesting and emotionally mature, avoiding the toxic patterns of seeking validation through romantic relationships, learning to be comfortable with potential rejection while maintaining self-respect, and creating an intentional lifestyle that naturally draws compatible individuals who appreciate and resonate with one's authentic self, all while maintaining the understanding that healthy relationships are built on mutual respect, shared values, emotional intelligence, and the willingness to continuously grow both individually and together.`,
} as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-8">
      <main className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
        <header className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            QuizMe App 🧠
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Transform any text into an interactive quiz using AI. Perfect for studying, 
            learning new topics, or testing your knowledge!
          </p>
        </header>

        <div className="space-y-6">
          <TextInput suggestedTopics={SUGGESTED_TOPICS} />
          
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

          <CommunityQuizzes />
        </div>
      </main>
    </div>
  );
}
