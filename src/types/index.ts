export interface Question {
  id: number;
  question: string;
  text?: string; // Added for compatibility with FeedbackSection
  options: string[];
  correctAnswer: string;
  hint: string;
}