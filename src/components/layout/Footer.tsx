import React from 'react';
import { BookOpen, Heart, GraduationCap } from 'lucide-react';
import syntheseData from '../../data/boite-a-merveilles/synthese.json';

interface FooterProps {
  onNavigate: (view: string, novelId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 text-stone-600 dark:text-stone-300 mt-20 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-800 text-amber-50 flex items-center justify-center font-sans text-xs font-semibold">
                PB
              </span>
              <span>PassBac</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md leading-relaxed">
              Plateforme d'apprentissage professionnelle et gratuite dédiée aux élèves marocains de la 1ère année du Baccalauréat. Conçue pour une révision rigoureuse, autonome et stimulante de l'examen régional.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span>Programme officiel du Ministère de l'Éducation Nationale</span>
              <span>·</span>
              <span>Maroc</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-xs tracking-wider uppercase">
              Œuvres au Programme
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('novel', 'boite-a-merveilles')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  La Boîte à merveilles (Ahmed Sefrioui)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('novel', 'dernier-jour')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Le Dernier Jour d'un Condamné (module actif)
                </button>
              </li>
              <li className="text-stone-400 dark:text-stone-600 cursor-not-allowed">
                Antigone (À venir)
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-xs tracking-wider uppercase">
              Ressources & Outils
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('novel', 'boite-a-merveilles')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Synthèse des connaissances ({syntheseData.knowledgeItems.length} fiches)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Leçons de langue et exercices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lexicon')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Lexique du souvenir enrichi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors text-left"
                >
                  Projet & Architecture modulaire
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Cap Régional 1ère Bac. Initiative éducative indépendante et gratuite.</p>
          <p className="flex items-center gap-1.5">
            Développé pour la réussite des bacheliers du Maroc
          </p>
        </div>
      </div>
    </footer>
  );
};
