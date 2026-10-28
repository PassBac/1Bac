import React, { useState } from 'react';
import { LexiqueData, LexiqueEntryItem } from '../../types';
import { Search, Sparkles, BookOpen } from 'lucide-react';

interface LexiqueTabProps {
  data: LexiqueData;
}

export const LexiqueTab: React.FC<LexiqueTabProps> = ({ data }) => {
  const [search, setSearch] = useState<string>('');
  const [filterWithQuote, setFilterWithQuote] = useState<boolean>(false);

  const entries = data.entries;
  const totalEntries = entries.length;

  const filtered = entries.filter((e) => {
    if (filterWithQuote && !e.context) {
      return false;
    }
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            {data.targetAudience} · {totalEntries} Mots & Expressions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {data.bankTitle}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Sources documentaires : {data.sourceDocument}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterWithQuote(!filterWithQuote)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filterWithQuote
                ? 'bg-amber-800 text-white border-amber-800'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
          >
            {filterWithQuote ? 'Toutes les entrées' : 'Avec citation uniquement'}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un mot, un synonyme ou une expression..."
          className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 dark:focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 shadow-xs"
        />
      </div>

      {/* Lexicon cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <h3 className="min-w-0 break-words font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {item.word}
                </h3>
                {item.category && (
                  <span className="max-w-[52%] min-w-0 whitespace-normal break-words text-right text-[10px] uppercase font-mono text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                )}
                {!item.category && item.chapterId && (
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
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/60 text-xs">
                <span className="font-semibold text-amber-900 dark:text-amber-300 block mb-1 text-[11px] uppercase tracking-wider">
                  Contexte dans le roman :
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
