import React, { useState } from 'react';
import { NovelSummary, UserStudyProgress } from '../../types';
import { SyntheseTab } from './SyntheseTab';
import { QuizTab } from './QuizTab';
import { LexiqueTab } from './LexiqueTab';
import { FlashcardsView } from '../features/FlashcardsView';
import { MindMapView } from '../features/MindMapView';
import { ChaptersOverviewView } from '../features/ChaptersOverviewView';
import { getNovelStudyData } from '../../data/novelStudyData';

import { BookOpen, Users, HelpCircle, Sparkles, ArrowLeft, Network, Layers, BookmarkCheck, CheckCircle2 } from 'lucide-react';

interface NovelViewProps {
  novel: NovelSummary;
  progress: UserStudyProgress;
  onToggleFlashcardMastery: (cardId: string) => void;
  onToggleChapter: (chapterId: string) => void;
  onScoreRecorded: (updated: UserStudyProgress) => void;
  onBackToHome: () => void;
}

export const NovelView: React.FC<NovelViewProps> = ({
  novel,
  progress,
  onToggleFlashcardMastery,
  onToggleChapter,
  onScoreRecorded,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [activeQuizChapterIdx, setActiveQuizChapterIdx] = useState<number>(0);

  const studyData = getNovelStudyData(novel.id);
  const quizBanks = studyData?.quizBanks ?? [];
  const chapterIds = studyData?.chaptersSyllabus.length
    ? studyData.chaptersSyllabus.map((chapter) => chapter.id)
    : quizBanks.map((bank) => bank.chapterId);
  const totalQuizQuestions = quizBanks.reduce((total, bank) => total + bank.questions.length, 0);
  const flashcardIds = studyData
    ? [
        ...studyData.lexiqueData.entries.map((entry) => `lex_${entry.id}`),
        ...studyData.syntheseData.knowledgeItems.map((item) => `syn_${item.id}`),
      ]
    : [];
  const completedChapterCount = progress.completedChapters.filter((id) =>
    chapterIds.includes(id)
  ).length;
  const masteredFlashcardCount = studyData
    ? studyData.lexiqueData.entries.filter((entry) =>
        progress.masteredFlashcards.includes(`lex_${entry.id}`)
      ).length +
      studyData.syntheseData.knowledgeItems.filter(
        (item) =>
          progress.masteredFlashcards.includes(`syn_${item.id}`) ||
          progress.masteredFlashcards.includes(item.id)
      ).length
    : 0;
  const totalStudyUnits = chapterIds.length;

  const tabs = [
    { id: 'chapters', label: `${studyData?.unitLabel || 'Chapitres'} (${completedChapterCount}/${totalStudyUnits})`, icon: BookmarkCheck },
    { id: 'mindmap', label: 'Arbre Mental Interactif', icon: Network },
    { id: 'flashcards', label: `Cartes Mémoires (${masteredFlashcardCount}/${flashcardIds.length})`, icon: Layers },
    { id: 'quizzes', label: `Banque de Quiz (${totalQuizQuestions} Questions)`, icon: HelpCircle },
    { id: 'synthese', label: 'Synthèse des Connaissances', icon: BookOpen },
    { id: 'lexicon', label: 'Lexique du Souvenir', icon: Sparkles },
  ];

  const handleOpenQuizFromChapter = (chapterIdx: number) => {
    setActiveQuizChapterIdx(chapterIdx);
    setActiveTab('quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!studyData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 animate-in fade-in duration-200">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PassBac · Retour à l'accueil</span>
        </button>

        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-xs space-y-6 transition-colors duration-200">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-amber-900 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded">
                {novel.genre} · {novel.publishYear}
              </span>
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                {novel.century} ({novel.period})
              </span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {novel.title}
            </h2>
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              {novel.author} ({novel.authorLife})
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider block">
              Présentation de l'œuvre :
            </span>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
              {novel.shortDescription}
            </p>
          </div>

          <div className="p-5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold block">Module en cours de préparation :</span>
              <span className="text-stone-600 dark:text-stone-300">
                La structure est prête pour recevoir les futurs fichiers JSON (fiches, quiz, personnages).
              </span>
            </div>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs whitespace-nowrap transition-colors shrink-0"
            >
              Voir La Boîte à merveilles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PassBac · Retour à l'accueil</span>
        </button>

        <div className="text-xs text-stone-500 dark:text-stone-400">
          <span>Français 1ère Bac</span>
          <span className="mx-2">·</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{novel.title}</span>
        </div>
      </div>

      {/* Novel Header Presentation */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-5 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {novel.genre} · {novel.author} ({novel.publishYear})
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {novel.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-lg shrink-0">
            <span>{studyData.spatialFrame}</span>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="pt-2 overflow-x-auto no-scrollbar border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 min-w-max py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-xs font-bold'
                      : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700/80 border border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-stone-400 dark:text-stone-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active View */}
      <div className="mt-6">
        {activeTab === 'chapters' && (
          <ChaptersOverviewView
            quizBanks={quizBanks}
            lexiqueData={studyData.lexiqueData}
            progress={progress}
            onOpenQuiz={handleOpenQuizFromChapter}
            onToggleChapter={onToggleChapter}
            onOpenFlashcards={() => setActiveTab('flashcards')}
            chaptersSyllabus={studyData.chaptersSyllabus.length ? studyData.chaptersSyllabus : undefined}
            unitLabel={studyData.unitLabel}
            unitLabelSingular={studyData.unitLabelSingular}
            unitCompletedAdjective={studyData.unitCompletedAdjective}
            completedHeading={studyData.completedHeading}
            unitShortLabel={studyData.unitShortLabel}
            unitHeading={studyData.unitHeading}
          />
        )}

        {activeTab === 'mindmap' && (
          <MindMapView
            personnagesData={studyData.personnagesData}
            syntheseData={studyData.syntheseData}
            novelId={novel.id}
            novelTitle={novel.title}
            novelAuthor={novel.author}
            novelPublishYear={novel.publishYear}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            lexiqueData={studyData.lexiqueData}
            syntheseData={studyData.syntheseData}
            masteredIds={progress.masteredFlashcards}
            soundEnabled={false}
            onToggleMastery={onToggleFlashcardMastery}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizTab
            key={activeQuizChapterIdx}
            quizBanks={quizBanks}
            initialChapterIndex={activeQuizChapterIdx}
            progress={progress}
            onScoreRecorded={onScoreRecorded}
          />
        )}

        {activeTab === 'synthese' && (
          <SyntheseTab
            data={studyData.syntheseData}
            completedItems={progress.masteredFlashcards}
            onToggleItem={onToggleFlashcardMastery}
          />
        )}

        {activeTab === 'lexicon' && (
          <LexiqueTab data={studyData.lexiqueData} />
        )}
      </div>
    </div>
  );
};
