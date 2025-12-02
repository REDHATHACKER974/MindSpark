
// Bot Identifiers
export enum BotType {
  DoubtBuster = 'doubt-buster',
  QuizAce = 'quiz-ace',
  GraphGenie = 'graph-genie',
  EchoVoice = 'echo-voice',
  TransBot = 'trans-bot',
  ReportGenerator = 'report-generator',
  DocuMind = 'docu-mind',
  PixelCanvas = 'pixel-canvas',
  FlashMind = 'flash-mind',
}

// Data structures for GraphGenie
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Data structures for QuizAce
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-based index
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

// Data structures for FlashMind
export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardSet {
  topic: string;
  cards: Flashcard[];
}

// Task Master
export type TaskCategory = 'Study' | 'Personal' | 'Work' | 'Other';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date?: string; // ISO Date string
  category: TaskCategory;
}

export interface StudyGroup {
  id: string;
  grade: string;
  name: string;
  topic: string;
  members: number;
}

// Gamification
export interface UserStats {
  xp: number;
  level: number;
  badges: string[];
}

export interface GamificationProps {
  onReward: (xp: number, message: string) => void;
}
