import React, { useState, useEffect } from 'react';
import { NovelId, UserStudyProgress } from './types';
import { NOVELS } from './data/novels';
import {
  getStoredStudyProgress,
  toggleFlashcardMastery,
  toggleChapterMastery,
  recordQuizScore,
  resetStudyProgress,
} from './services/storage';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { NovelView } from './components/novel/NovelView';
import { LexiqueGlobalPage } from './components/lexicon/LexiqueGlobalPage';
import { AboutPage } from './components/about/AboutPage';
import quizData from './data/boite-a-merveilles/quiz.json';

const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const saved = localStorage.getItem('passbac_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch (error) {
    console.error('Erreur lecture du thème enregistré:', error);
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedNovelId, setSelectedNovelId] = useState<NovelId>('boite-a-merveilles');
  const [progress, setProgress] = useState<UserStudyProgress>(getStoredStudyProgress());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global dark mode state synchronized with localStorage and documentElement
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('passbac_theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Erreur enregistrement du thème:', error);
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sync hash routing for GitHub Pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'home') {
        setCurrentView('home');
      } else if (hash.startsWith('novel/')) {
        const novelId = hash.replace('novel/', '') as NovelId;
        setSelectedNovelId(novelId);
        setCurrentView('novel');
      } else if (hash === 'lexicon' || hash === 'about') {
        setCurrentView(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNavigate = (view: string, novelId?: string) => {
    if (view === 'novel') {
      const id = (novelId as NovelId) || selectedNovelId;
      setSelectedNovelId(id);
      window.location.hash = `novel/${id}`;
      setCurrentView('novel');
    } else {
      window.location.hash = view === 'home' ? '' : view;
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNovel = (novelId: NovelId) => {
    setSelectedNovelId(novelId);
    window.location.hash = `novel/${novelId}`;
    setCurrentView('novel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFlashcardMastery = (cardId: string) => {
    const updated = toggleFlashcardMastery(cardId);
    setProgress(updated);
    const isNowDone = updated.masteredFlashcards.includes(cardId);
    showToast(
      isNowDone
        ? 'Carte marquée comme maîtrisée !'
        : 'Carte remise en révision.'
    );
  };

  const handleToggleChapter = (chapterId: string) => {
    const updated = toggleChapterMastery(chapterId);
    setProgress(updated);
    const isNowDone = updated.completedChapters.includes(chapterId);
    showToast(
      isNowDone
        ? 'Chapitre marqué comme étudié !'
        : 'Chapitre remis dans la liste d\'étude.'
    );
  };

  const handleScoreRecorded = (updated: UserStudyProgress) => {
    setProgress(updated);
    showToast('Résultats du quiz enregistrés dans votre suivi !');
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Voulez-vous réinitialiser votre progression d\'étude (chapitres étudiés et cartes maîtrisées) ?'
      )
    ) {
      const updated = resetStudyProgress();
      setProgress(updated);
      showToast('Votre progression a été réinitialisée.');
    }
  };

  const selectedNovel =
    NOVELS.find((n) => n.id === selectedNovelId) || NOVELS[0];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 selection:bg-amber-100 dark:selection:bg-amber-950/80 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Navbar with PassBac branding and dark mode toggle */}
      <Navbar
        currentView={currentView}
        selectedNovelId={selectedNovelId}
        onNavigate={handleNavigate}
        completedChapterCount={progress.completedChapters.filter((id) =>
          quizData.some((bank) => bank.chapterId === id)
        ).length}
        chapterCount={quizData.length}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            novels={NOVELS}
            progress={progress}
            onSelectNovel={handleSelectNovel}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentView === 'novel' && (
          <NovelView
            novel={selectedNovel}
            progress={progress}
            onToggleFlashcardMastery={handleToggleFlashcardMastery}
            onToggleChapter={handleToggleChapter}
            onScoreRecorded={handleScoreRecorded}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'lexicon' && <LexiqueGlobalPage />}

        {currentView === 'about' && <AboutPage />}
      </main>

      {/* Clean quiet toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
