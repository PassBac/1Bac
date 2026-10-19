import React, { useState } from 'react';
import { PersonnagesData, PersonnageCategory, PersonnageItem } from '../../types';
import { Users, Search, Home, MapPin } from 'lucide-react';

interface PersonnagesTabProps {
  data: PersonnagesData;
}

export const PersonnagesTab: React.FC<PersonnagesTabProps> = ({ data }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredCategories = data.categories.map((cat) => {
    let filteredChars = cat.personnages;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      filteredChars = filteredChars.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.role?.toLowerCase().includes(q) ||
          p.profession?.toLowerCase().includes(q)
      );
    }
    return {
      ...cat,
      personnages: filteredChars,
    };
  }).filter((cat) => {
    if (selectedCatId !== 'all' && cat.id !== selectedCatId) return false;
    return cat.personnages.length > 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {data.genre} · {data.auteur}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
              {data.titre}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-lg shrink-0">
            <MapPin className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Cadre spatial : {data.cadre_spatial}</span>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCatId === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Tous les groupes ({data.categories.length})
            </button>
            {data.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCatId(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCatId === c.id
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {c.nom.replace(/^[0-9.]+\s*/, '')}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un personnage..."
              className="w-full sm:w-64 px-3.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 dark:focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
          </div>
        </div>
      </div>

      {/* Render Categorized Personnages */}
      <div className="space-y-8">
        {filteredCategories.map((cat) => (
          <section key={cat.id} className="space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                <span>{cat.nom}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.personnages.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                        {p.nom}
                      </h4>
                      {p.age && (
                        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {p.age}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {p.role && (
                        <span className="font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded">
                          {p.role}
                        </span>
                      )}
                      {p.profession && (
                        <span className="text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {p.profession}
                        </span>
                      )}
                      {p.emplacement && (
                        <span className="text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {p.emplacement}
                        </span>
                      )}
                      {p.statut && (
                        <span className="text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {p.statut}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
