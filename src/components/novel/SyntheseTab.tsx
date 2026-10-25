import React, { useState } from 'react';
import { SyntheseData, KnowledgeItem } from '../../types';
import { CheckCircle2, Circle, Search, Sparkles, BookOpen, Layers } from 'lucide-react';

interface SyntheseTabProps {
  data: SyntheseData;
  completedItems: string[];
  onToggleItem: (itemId: string) => void;
}

export const SyntheseTab: React.FC<SyntheseTabProps> = ({
  data,
  completedItems,
  onToggleItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = Array.from(
    new Set(data.knowledgeItems.map((item) => item.category))
  );
  const totalItems = data.knowledgeItems.length;

  const filteredItems = data.knowledgeItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchExp = item.explanation.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchExp && !matchCat) return false;
    }
    return true;
  });

  const completedCount = data.knowledgeItems.filter(
    (item) => completedItems.includes(`syn_${item.id}`) || completedItems.includes(item.id)
  ).length;
  const progressPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            {data.targetAudience} · {categories.length} Catégories thématiques
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {data.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4 shrink-0 min-w-[200px] space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span>Points assimilés :</span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
              {completedCount} / {totalItems}
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 text-right font-medium">
            {progressPct}% de la synthèse maîtrisée
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Tous ({totalItems})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un concept..."
            className="w-full sm:w-64 px-3.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 dark:focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Grid of Knowledge Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const masteryId = `syn_${item.id}`;
          const hasPrefixedId = completedItems.includes(masteryId);
          const hasLegacyId = completedItems.includes(item.id);
          const isDone = hasPrefixedId || hasLegacyId;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isDone
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 pt-1">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onToggleItem(hasPrefixedId ? masteryId : hasLegacyId ? item.id : masteryId)}
                    className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                      isDone
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    title={isDone ? 'Marqué comme assimilé' : 'Marquer comme assimilé'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                <span className="truncate max-w-[280px]">
                  {item.keywords?.length
                    ? `Mots-clés : ${item.keywords.join(' · ')}`
                    : item.source ? `Source : ${item.source}` : ''}
                </span>
                <span className="font-mono text-stone-400 dark:text-stone-500">#{item.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
