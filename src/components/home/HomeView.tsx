import React from 'react';
import { NovelSummary, NovelId, UserStudyProgress } from '../../types';
import { BookOpen, ArrowRight, Sparkles, HelpCircle, GitBranch, Layers, RotateCcw, CheckCircle2 } from 'lucide-react';
import quizData from '../../data/boite-a-merveilles/quiz.json';
import lexiqueData from '../../data/boite-a-merveilles/lexique.json';
import syntheseData from '../../data/boite-a-merveilles/synthese.json';

const chapterCount = quizData.length;
const quizQuestionCount = quizData.reduce((total, bank) => total + bank.questions.length, 0);
const vocabularyCount = lexiqueData.entries.length;
const synthesisItemCount = syntheseData.knowledgeItems.length;
const flashcardCount = vocabularyCount + synthesisItemCount;

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
  const boiteNovel = novels.find((n) => n.id === 'boite-a-merveilles') || novels[0];
  const otherNovels = novels.filter((n) => n.id !== 'boite-a-merveilles');
  const validChapterIds = new Set(quizData.map((bank) => bank.chapterId));
  const validFlashcardIds = new Set([
    ...lexiqueData.entries.map((entry) => `lex_${entry.id}`),
    ...syntheseData.knowledgeItems.map((item) => `syn_${item.id}`),
  ]);
  const completedChapCount = progress.completedChapters.filter((id) => validChapterIds.has(id)).length;
  const masteredCardsCount = progress.masteredFlashcards.filter((id) => validFlashcardIds.has(id)).length;

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

        {/* Clean Professional Stats Summary */}
        <div className="bg-stone-50 dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-700/80 shrink-0 min-w-[260px] space-y-4">
          <div className="text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider">
            Votre état d'avancement
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400">Chapitres étudiés :</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {completedChapCount} / {chapterCount} chapitres
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400">Cartes mémoires :</span>
              <span className="font-mono font-bold text-amber-900 dark:text-amber-400 tabular-nums">
                {masteredCardsCount} maîtrisée{masteredCardsCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectNovel('boite-a-merveilles')}
            className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Accéder à La Boîte à merveilles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CARD 1: LA BOITE A MERVEILLES (Active) */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl border-2 border-amber-400 dark:border-amber-600/70 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between transition-colors duration-200">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60">
                  {boiteNovel.genre} · {boiteNovel.publishYear}
                </span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Module d'étude actif</span>
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                  {boiteNovel.title}
                </h3>
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-400">
                  {boiteNovel.author} ({boiteNovel.authorLife})
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                  {boiteNovel.shortDescription}
                </p>
              </div>

              {/* 4 Interactive Tools Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <button
                  onClick={() => onSelectNovel('boite-a-merveilles')}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-colors space-y-1 group"
                >
                  <div className="text-amber-800 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4" />
                    <span>Arbre Mental</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Branches & Personnages</div>
                </button>

                <button
                  onClick={() => onSelectNovel('boite-a-merveilles')}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-colors space-y-1 group"
                >
                  <div className="text-amber-800 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Cartes Mémoires</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">{flashcardCount} cartes recto-verso</div>
                </button>

                <button
                  onClick={() => onSelectNovel('boite-a-merveilles')}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-colors space-y-1 group"
                >
                  <div className="text-amber-800 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Banque Quiz</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">{quizQuestionCount} questions · {chapterCount} chapitres</div>
                </button>

                <button
                  onClick={() => onSelectNovel('boite-a-merveilles')}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-colors space-y-1 group"
                >
                  <div className="text-amber-800 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Synthèse</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">{synthesisItemCount} repères thématiques</div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Chapitres étudiés : <strong className="text-stone-900 dark:text-stone-100">{completedChapCount} / {chapterCount}</strong>
              </span>

              <button
                onClick={() => onSelectNovel('boite-a-merveilles')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ouvrir l'étude de l'œuvre</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARDS 2 & 3: LE DERNIER JOUR & ANTIGONE */}
          <div className="space-y-6">
            {otherNovels.map((novel) => (
              <div
                key={novel.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-xs space-y-4 hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase font-semibold">
                      {novel.century} · {novel.genre}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                      Structure prête
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    {novel.title}
                  </h4>
                  <div className="text-xs text-stone-600 dark:text-stone-300 font-semibold">
                    {novel.author} ({novel.authorLife})
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {novel.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => onSelectNovel(novel.id)}
                    className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Voir la fiche de l'œuvre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
