export type SubjectId = 'francais' | 'histoire_geo' | 'islamique' | 'arabe';
export type NovelId = 'boite-a-merveilles' | 'dernier-jour' | 'antigone';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'coming_soon';
}

export interface NovelSummary {
  id: NovelId;
  title: string;
  author: string;
  authorLife: string;
  genre: string;
  publishYear: number;
  century: string;
  period: string;
  coverImage: string;
  shortDescription: string;
  status: 'active' | 'coming_soon';
  totalChapters: number;
  estimatedStudyTime: string;
}

// 1. Synthese des connaissances
export interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  explanation: string;
  source: string;
  verified: boolean;
}

export interface SyntheseData {
  title: string;
  description: string;
  targetAudience: string;
  totalCategories: number;
  totalItems: number;
  knowledgeItems: KnowledgeItem[];
}

// 2. Personnages
export interface PersonnageItem {
  nom: string;
  role?: string;
  age?: string;
  profession?: string;
  emplacement?: string;
  statut?: string;
  description: string;
}

export interface PersonnageCategory {
  id: string;
  nom: string;
  description: string;
  personnages: PersonnageItem[];
}

export interface PersonnagesData {
  titre: string;
  auteur: string;
  genre: string;
  cadre_spatial: string;
  categories: PersonnageCategory[];
}

// 3. Quiz
export interface QuizQuestionItem {
  id: string;
  chapterId: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: number | boolean;
  expectedAnswer?: string;
  gradingCriteria?: string[];
  explanation: string;
  source: string;
  verified: boolean;
}

export interface QuizChapterBank {
  bankTitle: string;
  targetAudience: string;
  chapterId: string;
  chapterTitle: string;
  totalQuestions: number;
  questions: QuizQuestionItem[];
}

// 4. Lexique
export interface LexiqueEntryItem {
  id: string;
  word: string;
  definition: string;
  synonymes: string[] | null;
  context: string | null;
  chapterId: string | null;
  source: string;
  verified: boolean;
}

export interface LexiqueData {
  bankTitle: string;
  targetAudience: string;
  sourceDocument: string;
  totalEntries: number;
  entries: LexiqueEntryItem[];
}

// User professional progress (no childish XP or streaks)
export interface UserStudyProgress {
  completedChapters: string[]; // ['chapitre-1', 'chapitre-2', ...]
  masteredFlashcards: string[]; // IDs of cards marked as mastered
  quizScores: Record<string, { score: number; total: number; timestamp: number }>;
}
