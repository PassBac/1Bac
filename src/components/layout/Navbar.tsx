import React, { useState } from 'react';
import { BookOpen, Menu, X, CheckCircle2, Sun, Moon } from 'lucide-react';
import { NovelId } from '../../types';

interface NavbarProps {
  currentView: string;
  selectedNovelId?: NovelId;
  onNavigate: (view: string, novelId?: string) => void;
  completedChapterCount: number;
  chapterCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedNovelId = 'boite-a-merveilles',
  onNavigate,
  completedChapterCount,
  chapterCount,
  isDarkMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string, novelId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, novelId);
  };

  const isNovelActive = (id: string) => {
    return currentView === 'novel' && selectedNovelId === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Wordmark: PassBac - Français 1ère Bac */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left font-serif font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2.5 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-800 text-amber-50 flex items-center justify-center font-sans text-xs font-bold shadow-xs">
            PB
          </span>
          <div className="flex flex-col text-left">
            <span className="leading-tight font-serif text-lg font-bold text-stone-900 dark:text-stone-100">PassBac</span>
            <span className="text-[10px] text-amber-900 dark:text-amber-400 font-sans uppercase tracking-wider font-semibold">Français · 1ère Bac</span>
          </div>
        </button>

        {/* Desktop Navigation Links with all 3 novel titles */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              currentView === 'home'
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Accueil
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>

          {/* Roman 1 */}
          <button
            onClick={() => handleNavClick('novel', 'boite-a-merveilles')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              isNovelActive('boite-a-merveilles')
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            La Boîte à merveilles
            {isNovelActive('boite-a-merveilles') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>

          {/* Roman 2 */}
          <button
            onClick={() => handleNavClick('novel', 'dernier-jour')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              isNovelActive('dernier-jour')
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Le Dernier Jour d'un Condamné
            {isNovelActive('dernier-jour') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>

          {/* Roman 3 */}
          <button
            onClick={() => handleNavClick('novel', 'antigone')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              isNovelActive('antigone')
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Antigone
            {isNovelActive('antigone') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('lexicon')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              currentView === 'lexicon'
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Lexique
            {currentView === 'lexicon' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              currentView === 'about'
                ? 'text-amber-900 dark:text-amber-400 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            À propos
            {currentView === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 dark:bg-amber-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Medium Screen & Desktop Action Bar with Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active study badge */}
          <button
            onClick={() => handleNavClick('novel', 'boite-a-merveilles')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 transition-colors whitespace-nowrap shadow-2xs"
            title="Étudier La Boîte à merveilles"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>Étude active ({completedChapterCount}/{chapterCount} chap.)</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/80 hover:text-stone-900 dark:hover:text-white transition-colors duration-200 shadow-2xs"
            title={isDarkMode ? 'Basculer vers le mode clair' : 'Basculer vers le mode sombre'}
            aria-label="Basculer le mode sombre"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-2 pb-5 space-y-1 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="py-2 px-3 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 flex items-center justify-between">
            <span className="font-semibold">Français · 1ère Bac Maroc</span>
            <span>            {completedChapterCount}/{chapterCount} chapitres étudiés</span>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Accueil
          </button>

          <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 font-bold">
            Les 3 Romans au Programme
          </div>

          <button
            onClick={() => handleNavClick('novel', 'boite-a-merveilles')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
              isNovelActive('boite-a-merveilles')
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>La Boîte à merveilles</span>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">Complet</span>
          </button>

          <button
            onClick={() => handleNavClick('novel', 'dernier-jour')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isNovelActive('dernier-jour')
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Le Dernier Jour d'un Condamné
          </button>

          <button
            onClick={() => handleNavClick('novel', 'antigone')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isNovelActive('antigone')
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Antigone
          </button>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 my-1" />

          <button
            onClick={() => handleNavClick('lexicon')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'lexicon'
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Lexique du Souvenir
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'about'
                ? 'bg-amber-100/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            À propos de PassBac
          </button>

          {/* Mobile Theme Toggle Row */}
          <div className="pt-3 px-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Thème :</span>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isDarkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
