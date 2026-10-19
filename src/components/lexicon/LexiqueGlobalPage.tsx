import React, { useState } from 'react';
import { LexiqueData, LexiqueEntryItem } from '../../types';
import lexiqueData from '../../data/boite-a-merveilles/lexique.json';
import { Search, Sparkles, BookOpen } from 'lucide-react';

export const LexiqueGlobalPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [filterWithQuote, setFilterWithQuote] = useState<boolean>(false);

  const data = lexiqueData as LexiqueData;
  const entries = data.entries;
  const totalEntries = entries.length;

  const filtered = entries.filter((e) => {
    if (filterWithQuote && !e.context) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchWord = e.word.toLowerCase().includes(q);
      const matchDef = e.definition.toLowerCase().includes(q);
      const matchSyn = e.synonymes?.some((s) => s.toLowerCase().includes(q)) || false;
      const matchCtx = e.context?.toLowerCase().includes(q) || false;
      if (!matchWord && !matchDef && !matchSyn && !matchCtx) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
          {data.targetAudience}
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          {data.bankTitle}
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
          Répertoire de {totalEntries} termes et expressions pour enrichir votre vocabulaire et préparer l'examen régional. Sources : {data.sourceDocument}.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterWithQuote(false)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              !filterWithQuote
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold border border-stone-200 dark:border-stone-600'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Tous les mots ({totalEntries})
          </button>
          <button
            onClick={() => setFilterWithQuote(true)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterWithQuote
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold border border-stone-200 dark:border-stone-600'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Avec citation du roman
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un mot ou synonyme..."
            className="w-full sm:w-72 px-3.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 dark:focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {item.word}
                </h3>
                {item.chapterId && (
                  <span className="text-[10px] uppercase font-mono text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {item.chapterId.replace('-', ' ')}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {item.definition}
              </p>

              {item.synonymes && item.synonymes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">Synonymes :</span>
                  {item.synonymes.map((syn, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded font-medium"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {item.context && (
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/60 text-xs">
                <span className="font-semibold text-amber-900 dark:text-amber-300 block mb-1 text-[11px] uppercase tracking-wider">
                  Extrait / Contexte dans le roman :
                </span>
                <p className="font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
                  {item.context}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
