import React, { useState } from 'react';
import { ArrowDown, BookOpenText, Feather, Sparkles } from 'lucide-react';
import {
  PRODUCTION_WRITING_WORKS,
  ProductionWritingWork,
} from '../../data/productionEcrite';
import {
  WRITING_GUIDE,
  WRITING_RUBRIC,
  WRITING_TEMPLATES,
} from '../../data/writingTemplates';

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
    criteres_critere_discours_5pt: 'Critères du discours · 5 points',
    criteres_critere_langue_5pt: 'Critères de la langue · 5 points',
  };
  if (knownLabels[label]) return knownLabels[label];

  const developmentMatch = label.match(/^developpement_partie(\d+)(?:_(.*))?$/);
  if (developmentMatch) {
    const detail = developmentMatch[2] ? ` · ${formatLabel(developmentMatch[2])}` : '';
    return `Développement · partie ${developmentMatch[1]}${detail}`;
  }

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

const PLAN_ACCENTS = [
  'border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20',
  'border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20',
  'border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20',
  'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20',
  'border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20',
];

const WritingTemplatesSection: React.FC = () => (
  <section className="scroll-mt-24 space-y-5" id="canevas-redaction">
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 dark:border-amber-900/60 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-800 font-serif text-lg font-bold text-white dark:bg-amber-700">
          01
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
            Commencez ici · Méthode
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
            Les canevas de rédaction
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            Repérez d’abord le type de consigne, puis choisissez le plan qui lui
            correspond. Chaque carte présente sa logique ; ouvrez-la pour
            découvrir des formulations à adapter avec vos propres idées et exemples.
          </p>
        </div>
      </div>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      {WRITING_TEMPLATES.map((plan, index) => (
        <article
          key={plan.id_plan}
          className={`min-w-0 overflow-hidden rounded-2xl border shadow-xs ${PLAN_ACCENTS[index % PLAN_ACCENTS.length]}`}
        >
          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 font-mono text-xs font-bold text-stone-700 dark:bg-stone-900/70 dark:text-stone-200">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="break-words font-serif text-lg font-bold leading-snug text-stone-900 dark:text-stone-100">
                  {plan.nom_plan}
                </h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-stone-700 dark:text-stone-300 [overflow-wrap:anywhere]">
                  {plan.definition_et_usage}
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(plan.structure_logique).map(([stage, description]) => (
                <div
                  key={stage}
                  className="min-w-0 rounded-xl border border-white/80 bg-white/70 p-3 dark:border-stone-700/70 dark:bg-stone-900/50"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {formatLabel(stage)}
                  </p>
                  <p className="mt-1 break-words text-xs leading-relaxed text-stone-600 dark:text-stone-300 [overflow-wrap:anywhere]">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <details className="group rounded-xl border border-white/80 bg-white/75 dark:border-stone-700/70 dark:bg-stone-900/60">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                  Découvrir le canevas complet
                </span>
                <ArrowDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-5 border-t border-stone-200/80 p-4 dark:border-stone-700/80">
                <div className="space-y-4">
                  {Object.entries(plan.canevas_enrichi).map(([stage, text]) => (
                    <section key={stage} className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                        {formatLabel(stage)}
                      </h4>
                      <p className="break-words text-sm leading-relaxed text-stone-700 dark:text-stone-300 [overflow-wrap:anywhere]">
                        {text}
                      </p>
                    </section>
                  ))}
                </div>

                <div className="space-y-2 border-t border-stone-200/80 pt-4 dark:border-stone-700/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100">
                    Connecteurs utiles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.connecteurs_logiques_cles.map((connector) => (
                      <span
                        key={connector}
                        className="max-w-full break-words rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 [overflow-wrap:anywhere]"
                      >
                        {connector}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100">
                    Vocabulaire à retenir
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.vocabulaire_specifique.map((word) => (
                      <span
                        key={word}
                        className="max-w-full break-words rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-950 dark:bg-amber-950/50 dark:text-amber-200 [overflow-wrap:anywhere]"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 rounded-xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-800/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Exemple · {plan.exemple_application_oeuvre.oeuvre}
                  </p>
                  <p className="break-words text-sm font-semibold leading-relaxed text-stone-800 dark:text-stone-100 [overflow-wrap:anywhere]">
                    {plan.exemple_application_oeuvre.sujet_exemple}
                  </p>
                  <p className="break-words text-sm leading-relaxed text-stone-600 dark:text-stone-300 [overflow-wrap:anywhere]">
                    {plan.exemple_application_oeuvre.application}
                  </p>
                </div>

                <p className="break-words border-l-2 border-amber-400 pl-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300 [overflow-wrap:anywhere]">
                  <strong className="text-stone-900 dark:text-stone-100">
                    Point de vigilance :{' '}
                  </strong>
                  {plan.conseils_examen_et_pieges}
                </p>
              </div>
            </details>
          </div>
        </article>
      ))}
    </div>

    <details className="group rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-stone-800 dark:text-stone-100">
            Repères pour réussir l’épreuve
          </span>
          <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">
            Gestion du temps, présentation et critères du barème
          </span>
        </span>
        <ArrowDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid gap-5 border-t border-stone-100 p-5 dark:border-stone-800 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Gestion du temps
          </h3>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {WRITING_GUIDE.gestion_du_temps_1h}
          </p>
          <ul className="space-y-2">
            {WRITING_GUIDE.regles_d_or_presentation.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Barème indicatif · 10 points
          </h3>
          <StructuredContent value={WRITING_RUBRIC} />
        </div>
      </div>
    </details>
  </section>
);

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

      <WritingTemplatesSection />

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
