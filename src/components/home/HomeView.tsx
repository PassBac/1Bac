import React from 'react';
import { NovelSummary, NovelId, UserStudyProgress } from '../../types';
import { ArrowRight, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';
import { getNovelStudyData } from '../../data/novelStudyData';

interface HomeViewProps {
  novels: NovelSummary[];
  progress: UserStudyProgress;
  onSelectNovel: (novelId: NovelId) => void;
  onNavigate: (view: string) => void;
  onResetProgress: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  novels,
  progress,
  onSelectNovel,
  onNavigate,
  onResetProgress,
}) => {
  const studyDataByNovel = novels.map((novel) => ({
    novel,
    studyData: getNovelStudyData(novel.id),
  }));
  const activeModuleCount = studyDataByNovel.filter(({ studyData }) => studyData).length;
  const totalQuizQuestionCount = studyDataByNovel.reduce(
    (total, { studyData }) =>
      total + (studyData?.quizBanks.reduce((count, bank) => count + bank.questions.length, 0) || 0),
    0
  );

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Platform Presentation Hero Banner */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors duration-200">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            <span>PassBac · Français 1ère Bac Maroc</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 leading-tight">
            Préparez l'Examen Régional de Français avec Méthode
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Révisez les trois œuvres au programme de manière claire et active : arbre des personnages et des relations, cartes mémoires interactives, dossiers d'étude des chapitres et banque officielle de quiz.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-2">
            <span>100% Gratuit & sans inscription</span>
            <span>·</span>
            <span>Programme officiel du Ministère</span>
            <span>·</span>
            <span>Sauvegarde locale</span>
          </div>
        </div>

        {/* Neutral program overview */}
        <div className="bg-stone-50 dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-700/80 shrink-0 min-w-[260px] space-y-4">
          <div className="text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider">
            Le programme en un coup d'œil
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400">Œuvres au programme :</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {novels.length}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400">Modules disponibles :</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {activeModuleCount} / {novels.length}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400">Questions de quiz :</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {totalQuizQuestionCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Les Trois Romans au Programme */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider font-mono">
            Examen Régional · 1ère Année du Baccalauréat
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            Les Trois Romans au Programme
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Sélectionnez une œuvre pour accéder à ses ressources de révision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          {studyDataByNovel.map(({ novel, studyData }, index) => {
            const questionCount =
              studyData?.quizBanks.reduce((total, bank) => total + bank.questions.length, 0) || 0;
            const unitCount = studyData
              ? studyData.chaptersSyllabus.length || novel.totalChapters
              : novel.totalChapters;
            const unitLabel = studyData?.unitLabel || 'chapitres';
            const isActive = novel.status === 'active' && !!studyData;

            return (
              <article
                key={novel.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-600"
              >
                <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-200 dark:from-amber-600 dark:via-amber-400 dark:to-amber-900" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 font-mono text-sm font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {isActive ? 'Module disponible' : 'À venir'}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
                      {novel.century} · {novel.genre} · {novel.publishYear}
                    </p>
                    <h3 className="min-h-[3.5rem] font-serif text-2xl font-bold leading-tight text-stone-900 dark:text-stone-100">
                      {novel.title}
                    </h3>
                    <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                      {novel.author} <span className="font-normal">({novel.authorLife})</span>
                    </p>
                    <p className="min-h-[5.25rem] pt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400 line-clamp-4">
                      {novel.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-stone-50/80 py-3 dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-800/60">
                    <div className="px-2 text-center">
                      <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                        {unitCount}
                      </div>
                      <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                        {unitLabel}
                      </div>
                    </div>
                    <div className="px-2 text-center">
                      <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                        {studyData ? questionCount : '—'}
                      </div>
                      <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                        quiz
                      </div>
                    </div>
                    <div className="px-2 text-center">
                      <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                        {studyData ? studyData.lexiqueData.entries.length : '—'}
                      </div>
                      <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                        mots-clés
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => onSelectNovel(novel.id)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-800 text-white shadow-xs hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600'
                          : 'border border-stone-300 text-stone-700 hover:border-amber-400 hover:text-amber-900 dark:border-stone-700 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:text-amber-300'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>{isActive ? 'Ouvrir le module' : 'Découvrir l’œuvre'}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Reset progress button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser mon suivi d'étude</span>
        </button>
      </div>
    </div>
  );
};
