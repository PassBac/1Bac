import { UserStudyProgress } from '../types';

const STORAGE_KEY = 'passbac_etude_progress_v3';

const defaultProgress: UserStudyProgress = {
  completedChapters: ['chapitre-1'],
  masteredFlashcards: [],
  quizScores: {},
};

export const getStoredStudyProgress = (): UserStudyProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      completedChapters: parsed.completedChapters || ['chapitre-1'],
      masteredFlashcards: parsed.masteredFlashcards || [],
      quizScores: parsed.quizScores || {},
    };
  } catch (e) {
    console.error('Erreur lecture localStorage:', e);
    return defaultProgress;
  }
};

export const saveStudyProgress = (progress: UserStudyProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Erreur écriture localStorage:', e);
  }
};

export const toggleFlashcardMastery = (cardId: string): UserStudyProgress => {
  const current = getStoredStudyProgress();
  const list = current.masteredFlashcards || [];
  const exists = list.includes(cardId);
  const updatedList = exists
    ? list.filter((id) => id !== cardId)
    : [...list, cardId];

  const updated: UserStudyProgress = {
    ...current,
    masteredFlashcards: updatedList,
  };
  saveStudyProgress(updated);
  return updated;
};

export const toggleChapterMastery = (chapterId: string): UserStudyProgress => {
  const current = getStoredStudyProgress();
  const list = current.completedChapters || [];
  const exists = list.includes(chapterId);
  const updatedList = exists
    ? list.filter((id) => id !== chapterId)
    : [...list, chapterId];

  const updated: UserStudyProgress = {
    ...current,
    completedChapters: updatedList,
  };
  saveStudyProgress(updated);
  return updated;
};

export const recordQuizScore = (
  quizId: string,
  score: number,
  total: number
): UserStudyProgress => {
  const current = getStoredStudyProgress();
  const updated: UserStudyProgress = {
    ...current,
    quizScores: {
      ...current.quizScores,
      [quizId]: {
        score,
        total,
        timestamp: Date.now(),
      },
    },
  };
  saveStudyProgress(updated);
  return updated;
};

export const resetStudyProgress = (): UserStudyProgress => {
  saveStudyProgress(defaultProgress);
  return defaultProgress;
};
