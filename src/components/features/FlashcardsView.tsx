import React, { useState } from 'react';
import { LexiqueData, SyntheseData } from '../../types';
import { RotateCw, CheckCircle2, RotateCcw, Shuffle, Sparkles, BookOpen, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { playFlipSound, playCorrectSound } from '../../services/sound';

interface FlashcardItem {
  id: string;
  front: string;
  category: string;
  backTitle: string;
  backDescription: string;
  backNotes?: string[];
  contextQuote?: string | null;
  source?: string;
}

interface FlashcardsViewProps {
  lexiqueData: LexiqueData;
  syntheseData: SyntheseData;
  masteredIds: string[];
  soundEnabled: boolean;
  onToggleMastery: (cardId: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  lexiqueData,
  syntheseData,
  masteredIds,
  soundEnabled,
  onToggleMastery,
}) => {
  const [deckType, setDeckType] = useState<'lexique' | 'synthese'>('lexique');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered'>('all');

  // Convert raw JSON data into standardized flashcards
  const lexiqueCards: FlashcardItem[] = lexiqueData.entries.map((e) => ({
    id: `lex_${e.id}`,
    front: e.word,
    category: e.chapterId ? `Chapitre ${e.chapterId.replace('chapitre-', '')}` : 'Vocabulaire du souvenir',
    backTitle: 'Définition & Sens',
    backDescription: e.definition,
    backNotes: e.synonymes || undefined,
    contextQuote: e.context,
    source: e.source,
  }));

  const syntheseCards: FlashcardItem[] = syntheseData.knowledgeItems.map((k) => ({
    id: `syn_${k.id}`,
    front: k.title,
    category: k.category,
    backTitle: 'Synthèse & Explication',
    backDescription: k.explanation,
    contextQuote: null,
    source: k.source,
  }));

  const rawDeck = deckType === 'lexique' ? lexiqueCards : syntheseCards;

  const deck = rawDeck.filter((c) => {
    const isM = masteredIds.includes(c.id);
    if (filterMode === 'mastered') return isM;
    if (filterMode === 'unmastered') return !isM;
    return true;
  });

  const currentCard = deck[currentIndex] || deck[0];

  const handleFlip = () => {
    playFlipSound(soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
  };

  const handleMasteryClick = (cardId: string) => {
    const currentlyMastered = masteredIds.includes(cardId);
    if (!currentlyMastered) {
      playCorrectSound(soundEnabled);
    }
    onToggleMastery(cardId);
  };

  const masteredCount = rawDeck.filter((c) => masteredIds.includes(c.id)).length;
  const masteryPct = Math.round((masteredCount / rawDeck.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Deck Selector Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => {
              setDeckType('lexique');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              deckType === 'lexique'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Lexique du Souvenir ({lexiqueData.entries.length})
          </button>
          <button
            onClick={() => {
              setDeckType('synthese');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              deckType === 'synthese'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Synthèse thématique ({syntheseData.knowledgeItems.length})
          </button>
        </div>

        {/* Deck progress */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-stone-500 dark:text-stone-400">Maîtrise :</span>
          <div className="w-24 bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${masteryPct}%` }}
            />
          </div>
          <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 tabular-nums">
            {masteredCount}/{rawDeck.length} ({masteryPct}%)
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-sky-50 dark:bg-sky-950/30 p-4 text-xs text-sky-950 dark:text-sky-100">
        <Lightbulb className="w-4 h-4 shrink-0 text-sky-700 dark:text-sky-300 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Comment utiliser les cartes ?</strong> Lisez le terme ou la question sur la carte et essayez d’y répondre de mémoire. Cliquez ensuite sur la carte (ou appuyez sur Entrée/Espace) pour afficher la définition ou l’explication. Utilisez les flèches pour passer d’une carte à l’autre, puis marquez celles que vous connaissez pour suivre votre progression.
        </p>
      </div>

      {deck.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Toutes les cartes de ce filtre sont maîtrisées !
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Vous pouvez réinitialiser le filtre pour continuer à vous entraîner sur l'ensemble du paquet.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 text-white text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
          >
            Afficher toutes les cartes
          </button>
        </div>
      ) : (
        /* The 3D Interactive Flashcard */
        <div className="space-y-4">
          {/* Card container */}
          <div
            onClick={handleFlip}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleFlip();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Afficher le recto de la carte' : 'Afficher la réponse de la carte'}
            className="group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 min-h-[340px] sm:min-h-[380px] w-full rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600/70 p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between select-none"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/60 px-2.5 py-1 rounded-lg">
                {currentCard.category}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-stone-400 dark:text-stone-500 font-mono tabular-nums">
                  {currentIndex + 1} / {deck.length}
                </span>
                <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Cliquer pour revoir la question' : 'Cliquer pour voir la réponse'}</span>
                </span>
              </div>
            </div>

            {/* Middle body (Front vs Back) */}
            <div className="py-6 my-auto text-center space-y-4">
              {!isFlipped ? (
                /* RECTO (Front) */
                <div className="space-y-3 animate-in zoom-in-95 duration-150">
                  <span className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold block">
                    {deckType === 'lexique' ? 'Terme à définir' : 'Question clé'}
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-4xl text-stone-900 dark:text-stone-100 leading-tight">
                    {currentCard.front}
                  </h3>
                  <div className="text-xs text-stone-500 dark:text-stone-400 pt-2 italic">
                    Connaissez-vous le sens et l'usage de ce terme dans l'œuvre ?
                  </div>
                </div>
              ) : (
                /* VERSO (Back) */
                <div className="space-y-4 text-left max-w-lg mx-auto animate-in zoom-in-95 duration-150">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                      {currentCard.backTitle}
                    </span>
                    <p className="font-serif text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-relaxed font-medium">
                      {currentCard.backDescription}
                    </p>
                  </div>

                  {currentCard.backNotes && currentCard.backNotes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Synonymes :</span>
                      {currentCard.backNotes.map((syn, idx) => (
                        <span key={idx} className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[11px] px-2 py-0.5 rounded font-medium">
                          {syn}
                        </span>
                      ))}
                    </div>
                  )}

                  {currentCard.contextQuote && (
                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-xs font-serif italic text-stone-800 dark:text-stone-200">
                      « {currentCard.contextQuote} »
                    </div>
                  )}

                  {currentCard.source && (
                    <div className="text-[10px] text-stone-400 dark:text-stone-500 pt-1">
                      Source : {currentCard.source}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom status */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-mono text-stone-400 dark:text-stone-500">
                {isFlipped ? 'Verso (Réponse)' : 'Recto (Question)'}
              </span>

              {masteredIds.includes(currentCard.id) ? (
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Maîtrisée</span>
                </span>
              ) : (
                <span className="text-stone-400 dark:text-stone-500">En cours d'apprentissage</span>
              )}
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Carte précédente"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMasteryClick(currentCard.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  masteredIds.includes(currentCard.id)
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {masteredIds.includes(currentCard.id)
                    ? 'Déjà maîtrisé (Cliquez pour retirer)'
                    : 'Marquer comme maîtrisé'}
                </span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Carte suivante"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
