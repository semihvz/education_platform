export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
  isCorrect: boolean;
}

export interface QuestionExplanation {
  whyCorrect: string;
  whyOthersIncorrect: { [key: string]: string }; // e.g., { 'A': '...', 'C': '...' }
  topicSummary: string;
  keyTakeaway: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questionText: string;
  svgDiagram?: string; // Embedded SVG visual diagram code
  options: QuestionOption[];
  correctOptionId: string; // 'A', 'B', 'C', 'D', or 'E'
  explanation: QuestionExplanation;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  topic: string;
  frontTitle: string;
  frontCategory: string;
  backExplanation: string;
  backExample?: string;
  backKeyPoint: string;
  isLearned?: boolean;
}

export interface UserStats {
  totalAnswered: number;
  correctAnswers: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  topicMastery: { [topicName: string]: { total: number; correct: number } };
  totalTimeSpentSeconds?: number;
  averageTimePerQuestion?: number;
}

export interface AppSettings {
  apiKey: string;
  selectedModel: string;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface SavedQuestionItem {
  question: Question;
  userAnswerId: string;
  savedAt: number;
  wasCorrect: boolean;
  solveDurationSeconds?: number;
}

export interface SavedFlashcardItem {
  card: Flashcard;
  savedAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  timestamp: number;
  content: string;
  photoUrl?: string;
  photoCaption?: string;
  videoUrl?: string;
  videoCaption?: string;
  mood?: 'verimli' | 'motive' | 'yorgun' | 'odakli' | 'normal';
  tags?: string[];
}

export interface HourlyLogEntry {
  id: string;
  date: string;
  hour: string;
  timestamp: number;
  text: string;
  audioUrl?: string;
  imageUrl?: string;
}

