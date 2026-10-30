import React from 'react';
import { Heart, GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3 text-center">
        <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider font-mono">
          Projet éducatif bénévole & gratuit · 1ère Bac Maroc
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
          À propos de PassBac
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
          Une plateforme moderne et gratuite conçue pour accompagner chaque lycéen marocain dans sa préparation à l'épreuve de français de l'examen régional.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">100% Gratuit & Accessible</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Accessible librement à tous les élèves du Royaume, sans aucun abonnement, sans création de compte obligatoire et sans publicité.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Conforme au Cadre Officiel</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Aligné avec les exigences du Ministère de l'Éducation Nationale pour l'examen régional (étude de texte, figures de style, compréhension et production écrite).
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs transition-colors duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Confidentialité & Autonomie</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Votre progression et vos scores restent enregistrés sur votre appareil. Si vous envoyez le formulaire Avis, votre évaluation anonyme est transmise à la feuille Google privée de la plateforme. Aucun renseignement personnel n’est demandé.
          </p>
        </div>
      </div>

      {/* Program Summary Card */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-800 dark:text-amber-400" />
          <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            Les trois œuvres au programme du Régional de Français
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          La plateforme est spécialement dédiée aux trois romans au programme de français en première année du baccalauréat au Maroc :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1 text-xs">
            <span className="font-bold text-amber-950 dark:text-amber-200 block font-serif text-sm">
              La Boîte à merveilles
            </span>
            <span className="text-stone-600 dark:text-stone-400 block">Ahmed Sefrioui (1954)</span>
            <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">Roman autobiographique</span>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
            <span className="font-bold text-stone-900 dark:text-stone-100 block font-serif text-sm">
              Le Dernier Jour d'un Condamné
            </span>
            <span className="text-stone-600 dark:text-stone-400 block">Victor Hugo (1829)</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">Roman à thèse</span>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
            <span className="font-bold text-stone-900 dark:text-stone-100 block font-serif text-sm">
              Antigone
            </span>
            <span className="text-stone-600 dark:text-stone-400 block">Jean Anouilh (1944)</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">Tragédie moderne</span>
          </div>
        </div>
      </div>
    </div>
  );
};
