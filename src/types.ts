export type SubjectType = "math" | "lang" | "evs" | "art" | "life";

export interface Chapter {
  id: string;
  num: number;
  title: string;
  icon: string;
  summary: string;
  description: string;
  skills: string[];
  sampleActivityName: string;
  sampleActivitySteps: string[];
  storyStarter?: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SubjectConfig {
  id: SubjectType;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  badgeColor: string;
  gradient: string;
  chapters: Chapter[];
  signatureGame?: {
    id: string;
    emoji: string;
    name: string;
    description: string;
    skills: string[];
  };
}

export interface StudentProgress {
  subjectsCompleted: Record<SubjectType, number>;
  badgesEarned: {
    id: string;
    title: string;
    icon: string;
    unlockedAt: string;
    subject: SubjectType | "general";
  }[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  completedChapterIds: string[];
  speedGridBestTime?: number;
  pathfinderBestScore?: number;
  dailyStreak: number;
  lastActiveDate?: string;
  completedChapterPages?: Record<string, number[]>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface BuddyCharacter {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  bgColor: string;
  borderColor: string;
  voiceName: string;
  greeting: string;
}
