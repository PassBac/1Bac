import React, { useState } from 'react';
import { ArrowDown, BookOpenText, Feather, Sparkles } from 'lucide-react';
import {
  PRODUCTION_WRITING_WORKS,
  ProductionWritingWork,
} from '../../data/productionEcrite';

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const formatLabel = (label: string): string => {
  const knownLabels: Record<string, string> = {
    amorce: 'Amorce',
    annonce_plan: 'Annonce du plan',
    annonce_du_plan: 'Annonce du plan',
    poser_le_sujet: 'Présentation du sujet',
    positer_le_sujet: 'Présentation du sujet',
    problematique: 'Problématique',
    introduction: 'Introduction',
    developpement: 'Développement',
    conclusion: 'Conclusion',
    arguments: 'Arguments',
    exemples: 'Exemples',
    these: 'Idée principale',
    bilan: 'Bilan',
    ouverture: 'Ouverture',
    titre: 'Partie',
  };
  if (knownLabels[label]) return knownLabels[label];

  const partMatch = label.match(/^partie_(\d+)_(.*)$/);
  if (partMatch) {
    return `Partie ${partMatch[1]} · ${formatLabel(partMatch[2])}`;
  }

  return label
    .replace(/_/g, ' ')
    .replace(/([a-zà-ÿ])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (letter) => letter.toLocaleUpperCase('fr'));
};

const StructuredContent: React.FC<{ value: unknown; depth?: number }> = ({
  value,
  depth = 0,
}) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <p className="break-words text-sm leading-relaxed text-stone-700 dark:text-stone-300 [overflow-wrap:anywhere]">
        {value}
      </p>
    );
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'string' || typeof item === 'number')) {
      return (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <li
              key={`${index}-${String(item).slice(0, 24)}`}
              className="flex items-start gap-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-stone-200/80 bg-white/70 p-4 dark:border-stone-700/80 dark:bg-stone-900/60"
          >
            <StructuredContent value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (!isRecord(value) || depth > 7) return null;

  return (
    <div className={depth === 0 ? 'space-y-4' : 'space-y-3'}>
      {Object.entries(value).map(([key, child]) => {
        if (child === null || child === undefined) return null;
        const isNested = Array.isArray(child) || isRecord(child);
        const isPlainText = typeof child === 'string' || typeof child === 'number';

        return (
          <section
            key={key}
            className={isNested ? 'space-y-2' : 'space-y-1'}
          >
            <h4
              className={`font-semibold text-stone-800 dark:text-stone-100 ${
                depth === 0 ? 'text-sm' : 'text-xs'
              }`}
            >
              {formatLabel(key)}
            </h4>
            {isPlainText ? (
              <StructuredContent value={child} depth={depth + 1} />
            ) : (
              <div className="border-l-2 border-amber-200 pl-3 dark:border-amber-900/70">
                <StructuredContent value={child} depth={depth + 1} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

const SubjectList: React.FC<{ work: ProductionWritingWork }> = ({ work }) => (
  <div className="space-y-3">
    {work.subjects.map((subject, index) => (
      <details
        key={subject.id}
        className="group min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs transition-colors open:border-amber-300 dark:border-stone-800 dark:bg-stone-900 dark:open:border-amber-800"
      >
        <summary className="flex cursor-pointer list-none items-start gap-4 p-4 marker:hidden sm:items-center sm:p-5 [&::-webkit-details-marker]:hidden">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 font-mono text-sm font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.13em] text-amber-800 dark:text-amber-400">
              {subject.theme}
            </span>
            <span className="mt-1 block break-words font-serif text-base font-bold leading-snug text-stone-900 dark:text-stone-100 sm:text-lg">
              {subject.title}
            </span>
          </span>
          <ArrowDown className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180 sm:mt-0" />
        </summary>

        <div className="space-y-5 border-t border-stone-100 px-4 py-5 dark:border-stone-800 sm:px-6">
          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Sujet de rédaction
            </h3>
            <p className="break-words text-sm leading-relaxed text-stone-800 dark:text-stone-200 [overflow-wrap:anywhere]">
              {subject.prompt}
            </p>
          </div>

          <details className="group rounded-xl border border-stone-200 dark:border-stone-700">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 marker:hidden [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-sm font-bold text-stone-800 dark:text-stone-100">
                  Ouvrir les aides et la correction
                </span>
                <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">
                  À consulter après avoir essayé de rédiger votre réponse.
                </span>
              </span>
              <ArrowDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
            </summary>

            <div className="space-y-5 border-t border-stone-100 p-4 dark:border-stone-800 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Plan conseillé :
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {subject.plan}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100">
                  Pistes pour construire votre réponse
                </h3>
                <StructuredContent value={subject.outline} />
              </div>

              <div className="space-y-2 border-t border-stone-100 pt-4 dark:border-stone-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100">
                  Vocabulaire et connecteurs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subject.vocabulary.map((item) => (
                    <span
                      key={item}
                      className="max-w-full break-words rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 [overflow-wrap:anywhere]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </details>
    ))}
  </div>
);

export const ProductionEcriteView: React.FC = () => {
  const [selectedWorkId, setSelectedWorkId] = useState(PRODUCTION_WRITING_WORKS[0].id);
  const selectedWork =
    PRODUCTION_WRITING_WORKS.find((work) => work.id === selectedWorkId) ??
    PRODUCTION_WRITING_WORKS[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/70 to-orange-50/70 p-6 shadow-xs dark:border-amber-900/60 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30 sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border-[24px] border-amber-100/70 dark:border-amber-900/20" />
        <div className="relative max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
            <Feather className="h-4 w-4" />
            Atelier de rédaction · 1ère Bac
          </span>
          <h1 className="font-serif text-3xl font-bold leading-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            Production écrite
          </h1>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
            Entraînez-vous aux sujets inspirés des œuvres du programme. Lisez d’abord
            l’énoncé et rédigez votre réponse ; les aides et la correction restent
            masquées jusqu’à ce que vous décidiez de les ouvrir.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-stone-500 dark:text-stone-400">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>{PRODUCTION_WRITING_WORKS.reduce((total, work) => total + work.subjects.length, 0)} sujets pour les trois œuvres</span>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-amber-800 dark:text-amber-400" />
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Choisissez une œuvre
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRODUCTION_WRITING_WORKS.map((work, index) => {
            const isSelected = work.id === selectedWork.id;
            return (
              <button
                key={work.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedWorkId(work.id)}
                className={`min-w-0 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-sm dark:border-amber-700 dark:bg-amber-950/40'
                    : 'border-stone-200 bg-white hover:border-amber-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-900'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 font-mono text-xs font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    0{index + 1}
                  </span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-stone-600 dark:bg-stone-900/80 dark:text-stone-300">
                    {work.subjects.length} sujets
                  </span>
                </span>
                <span className="mt-4 block break-words font-serif text-lg font-bold leading-snug text-stone-900 dark:text-stone-100">
                  {work.title}
                </span>
                <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">
                  {work.author}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {selectedWork.author}
            </p>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              {selectedWork.title}
            </h2>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {selectedWork.subjects.length} sujets · Ouvrez une fiche pour la consulter
          </span>
        </div>
        <SubjectList work={selectedWork} />
      </section>
    </div>
  );
};
